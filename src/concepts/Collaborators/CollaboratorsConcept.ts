import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
import SessioningConcept from "@concepts/Sessioning/SessioningConcept.ts";
import UserAuthConcept from "@concepts/UserAuth/UserAuthConcept.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Collaborators" + ".";

// Generic types for the concept's external dependencies
type User = ID;
type Occasion = ID;
type CollaborationInvite = ID;

type InviteStatus = "pending" | "accepted" | "declined";

/**
 * State: A set of Collaborations linking users to occasions with invite status.
 */
interface CollaboratorDoc {
  _id: CollaborationInvite;
  occasionId: Occasion;
  user: User;
  sender: User;
  status: InviteStatus;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * @concept Collaborators
 * @purpose maintain a list of people working on occasions with invite workflow
 */
export default class CollaboratorsConcept {
  collaborators: Collection<CollaboratorDoc>;

  constructor(private readonly db: Db) {
    this.collaborators = this.db.collection(PREFIX + "collaborators");
  }

  /**
   * Action: Creates a pending invite for a user to collaborate on an occasion.
   * @requires The user exists, occasion exists, and no existing invite/collaboration for (occasion, user).
   * @effects A new pending invite is created.
   */
  async createInvite(args: {
    sender?: User;
    recipient?: User;
    occasionId: Occasion;
    // Optional fields for direct API usage via session + username
    session?: ID;
    recipientUsername?: string;
  }): Promise<{ invite: CollaborationInvite } | { error: string }> {
    const {
      sender,
      recipient,
      occasionId,
      session,
      recipientUsername,
    } = args;

    console.log("[Collaborators.createInvite] Called with raw args:", args);

    let resolvedSender: User | undefined = sender;
    let resolvedRecipient: User | undefined = recipient;

    // If sender/recipient not provided directly (sync path),
    // try to resolve them using session + recipientUsername (concept_server / direct API path).
    if ((!resolvedSender || !resolvedRecipient) && session && recipientUsername) {
      try {
        const sessioning = new SessioningConcept(this.db);
        const userAuth = new UserAuthConcept(this.db);

        const userFromSession = await sessioning._getUser({ session });
        const recipientDoc = await userAuth._getUserByUsername({
          username: recipientUsername,
        });

        if (userFromSession) {
          resolvedSender = userFromSession as User;
        }
        if (recipientDoc?._id) {
          resolvedRecipient = recipientDoc._id as User;
        }

        console.log(
          "[Collaborators.createInvite] Resolved from session + username:",
          {
            session,
            recipientUsername,
            resolvedSender,
            resolvedRecipient,
          },
        );
      } catch (e) {
        console.error(
          "[Collaborators.createInvite] Error resolving sender/recipient from session + username:",
          e,
        );
      }
    }

    // Guard against missing sender or recipient
    console.log("[Collaborators.createInvite] Final values:", {
      sender: resolvedSender,
      recipient: resolvedRecipient,
      occasionId,
      senderType: typeof resolvedSender,
      recipientType: typeof resolvedRecipient,
      occasionIdType: typeof occasionId,
      senderIsNull: resolvedSender === null,
      senderIsUndefined: resolvedSender === undefined,
      recipientIsNull: resolvedRecipient === null,
      recipientIsUndefined: resolvedRecipient === undefined,
    });

    if (!resolvedSender || !resolvedRecipient) {
      console.error(
        "[Collaborators.createInvite] Missing sender or recipient after resolution:",
        {
          sender: resolvedSender ?? "null/undefined",
          recipient: resolvedRecipient ?? "null/undefined",
        },
      );
      return { error: "Sender and recipient are required for an invite." };
    }

    // Additional check for empty strings (though IDs shouldn't be empty strings)
    if (
      (typeof resolvedSender === "string" && resolvedSender.trim() === "") ||
      (typeof resolvedRecipient === "string" && resolvedRecipient.trim() === "")
    ) {
      console.error("[Collaborators.createInvite] Empty sender or recipient:", {
        sender: resolvedSender === "" ? "empty string" : resolvedSender,
        recipient: resolvedRecipient === "" ? "empty string" : resolvedRecipient,
      });
      return { error: "Sender and recipient are required for an invite." };
    }

    // Check if there's already an invite or accepted collaboration
    const existing = await this.collaborators.findOne({
      occasionId,
      user: resolvedRecipient,
    });
    if (existing) {
      if (existing.status === "accepted") {
        return { error: `User ${recipient} is already a collaborator on this occasion.` };
      }
      if (existing.status === "pending") {
        return { error: `A pending invite already exists for user ${recipient} on this occasion.` };
      }
      // If declined, we can create a new invite
    }

    const inviteId = freshID() as CollaborationInvite;
    const now = new Date().toISOString();
    await this.collaborators.insertOne({
      _id: inviteId,
      occasionId,
      user: recipient,
      sender: resolvedSender,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
    return { invite: inviteId };
  }

  /**
   * Action: Accepts a pending invite, making the user a collaborator.
   * @requires The invite exists and is pending.
   * @effects The invite status is updated to "accepted".
   */
  async acceptInvite({
    invite,
    recipient,
  }: {
    invite: CollaborationInvite;
    recipient: User;
  }): Promise<Empty | { error: string }> {
    const inviteDoc = await this.collaborators.findOne({ _id: invite });
    if (!inviteDoc) {
      return { error: `Invite ${invite} not found.` };
    }
    if (inviteDoc.user !== recipient) {
      return { error: `User ${recipient} is not the recipient of this invite.` };
    }
    if (inviteDoc.status !== "pending") {
      return { error: `Invite ${invite} is not pending (current status: ${inviteDoc.status}).` };
    }

    await this.collaborators.updateOne(
      { _id: invite },
      { $set: { status: "accepted", updatedAt: new Date().toISOString() } }
    );
    return {};
  }

  /**
   * Action: Declines a pending invite.
   * @requires The invite exists and is pending.
   * @effects The invite status is updated to "declined".
   */
  async declineInvite({
    invite,
    recipient,
  }: {
    invite: CollaborationInvite;
    recipient: User;
  }): Promise<Empty | { error: string }> {
    const inviteDoc = await this.collaborators.findOne({ _id: invite });
    if (!inviteDoc) {
      return { error: `Invite ${invite} not found.` };
    }
    if (inviteDoc.user !== recipient) {
      return { error: `User ${recipient} is not the recipient of this invite.` };
    }
    if (inviteDoc.status !== "pending") {
      return { error: `Invite ${invite} is not pending (current status: ${inviteDoc.status}).` };
    }

    await this.collaborators.updateOne(
      { _id: invite },
      { $set: { status: "declined", updatedAt: new Date().toISOString() } }
    );
    return {};
  }

  /**
   * Action: Adds a user directly as a collaborator (for backward compatibility and direct adds).
   * @requires The user exists, occasion exists, and no existing collaboration for (occasion, user).
   * @effects The user is added as an accepted collaborator.
   */
  async addCollaborator({
    user,
    occasionId,
    sender,
  }: {
    user: User;
    occasionId: Occasion;
    sender: User;
  }): Promise<Empty | { error: string }> {
    const existing = await this.collaborators.findOne({
      occasionId,
      user,
      status: "accepted",
    });
    if (existing) {
      return { error: `User ${user} is already a collaborator on this occasion.` };
    }

    // If there's a pending/declined invite, update it to accepted
    const existingInvite = await this.collaborators.findOne({
      occasionId,
      user,
    });
    if (existingInvite) {
      await this.collaborators.updateOne(
        { _id: existingInvite._id },
        { $set: { status: "accepted", updatedAt: new Date().toISOString() } }
      );
      return {};
    }

    // Otherwise create a new accepted collaboration
    const inviteId = freshID() as CollaborationInvite;
    const now = new Date().toISOString();
    await this.collaborators.insertOne({
      _id: inviteId,
      occasionId,
      user,
      sender,
      status: "accepted",
      createdAt: now,
      updatedAt: now,
    });
    return {};
  }

  /**
   * Action: Removes a user from the set of collaborators for an occasion.
   * @requires The user exists and is currently a collaborator on the occasion.
   * @effects The collaboration is removed.
   */
  async removeCollaborator({
    user,
    occasionId,
  }: {
    user: User;
    occasionId: Occasion;
  }): Promise<Empty | { error: string }> {
    const existing = await this.collaborators.findOne({
      occasionId,
      user,
      status: "accepted",
    });
    if (!existing) {
      return { error: `User ${user} is not a collaborator on this occasion.` };
    }

    await this.collaborators.deleteOne({ _id: existing._id });
    return {};
  }

  /**
   * Query: Retrieves all incoming invites for a user (where user is recipient).
   * @requires None.
   * @effects Returns all pending invites where the user is the recipient.
   */
  async _getIncomingInvites({ recipient }: { recipient: User }): Promise<
    Array<{
      invite: CollaborationInvite;
      occasionId: Occasion;
      sender: User;
      status: InviteStatus;
      createdAt: string;
    }>
  > {
    const invites = await this.collaborators
      .find({ user: recipient, status: "pending" })
      .sort({ createdAt: -1 })
      .toArray();
    return invites.map((i) => ({
      invite: i._id,
      occasionId: i.occasionId,
      sender: i.sender,
      status: i.status,
      createdAt: i.createdAt,
    }));
  }

  /**
   * Query: Retrieves all sent invites for a user (where user is sender).
   * @requires None.
   * @effects Returns all invites sent by the user.
   */
  async _getSentInvites({ sender }: { sender: User }): Promise<
    Array<{
      invite: CollaborationInvite;
      occasionId: Occasion;
      recipient: User;
      status: InviteStatus;
      createdAt: string;
      updatedAt: string;
    }>
  > {
    const invites = await this.collaborators
      .find({ sender })
      .sort({ createdAt: -1 })
      .toArray();
    return invites.map((i) => ({
      invite: i._id,
      occasionId: i.occasionId,
      recipient: i.user,
      status: i.status,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
    }));
  }

  /**
   * Query: Retrieves all accepted collaborators for an occasion.
   * @requires The occasion exists.
   * @effects Returns all users who are accepted collaborators on the occasion.
   */
  async _getCollaboratorsForOccasion({
    occasionId,
  }: {
    occasionId: Occasion;
  }): Promise<User[]> {
    const collaborators = await this.collaborators
      .find({ occasionId, status: "accepted" })
      .toArray();
    return collaborators.map((c) => c.user);
  }

  /**
   * Query: Checks if a user is a collaborator on an occasion.
   * @requires The user and occasion exist.
   * @effects Returns true if the user is an accepted collaborator on the occasion, false otherwise.
   */
  async _isCollaboratorOnOccasion({
    user,
    occasionId,
  }: {
    user: User;
    occasionId: Occasion;
  }): Promise<boolean> {
    const collaborator = await this.collaborators.findOne({
      occasionId,
      user,
      status: "accepted",
    });
    return collaborator !== null;
  }

  /**
   * Query: Retrieves all users who are collaborators (backward compatibility - returns all accepted).
   * @requires None.
   * @effects Returns the set of all users who are accepted collaborators on any occasion.
   */
  async _getCollaborators(): Promise<User[]> {
    const collaborators = await this.collaborators
      .find({ status: "accepted" })
      .toArray();
    // Return unique users
    const uniqueUsers = new Set(collaborators.map((c) => c.user));
    return Array.from(uniqueUsers);
  }

  /**
   * Query: Checks if a user is a collaborator (backward compatibility).
   * @requires The user exists.
   * @effects Returns true if the user is an accepted collaborator on any occasion, false otherwise.
   */
  async _hasCollaborator({ user }: { user: User }): Promise<boolean> {
    const collaborator = await this.collaborators.findOne({
      user,
      status: "accepted",
    });
    return collaborator !== null;
  }

  /**
   * Query: Gets all occasion IDs where a user is an accepted collaborator.
   * @requires The user exists.
   * @effects Returns all occasion IDs where the user is a collaborator.
   */
  async _getOccasionsForCollaborator({ user }: { user: User }): Promise<Occasion[]> {
    const collaborations = await this.collaborators
      .find({ user, status: "accepted" })
      .toArray();
    return collaborations.map((c) => c.occasionId);
  }
}
