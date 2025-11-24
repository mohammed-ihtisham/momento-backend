import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Relationship" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type Relationship = ID;

/**
 * State: A set of Relationships with an owner, name, and relationshipType.
 */
interface RelationshipDoc {
  _id: Relationship;
  owner: User;
  name: string;
  relationshipType: string;
}

/**
 * @concept Relationship
 * @purpose track the people that a user cares about by attributing a relationship type to each person
 */
export default class RelationshipConcept {
  relationships: Collection<RelationshipDoc>;

  constructor(private readonly db: Db) {
    this.relationships = this.db.collection(PREFIX + "relationships");
  }

  /**
   * Action: Creates a new relationship for an owner.
   * @requires The user exists, name is not empty, relationshipType is not empty, and no Relationship owned by owner already has the name.
   * @effects A new relationship is created with the given owner, name, and relationshipType, and its ID is returned.
   */
  async createRelationship({
    owner,
    name,
    relationshipType,
  }: {
    owner: User;
    name: string;
    relationshipType: string;
  }): Promise<{ relationship: Relationship } | { error: string }> {
    if (name.trim() === "") {
      return { error: "Name cannot be empty." };
    }

    if (relationshipType.trim() === "") {
      return { error: "RelationshipType cannot be empty." };
    }

    const existingRelationship = await this.relationships.findOne({
      owner,
      name,
    });
    if (existingRelationship) {
      return {
        error: `Relationship with name "${name}" already exists for owner ${owner}.`,
      };
    }

    const relationshipId = freshID() as Relationship;
    await this.relationships.insertOne({
      _id: relationshipId,
      owner,
      name,
      relationshipType,
    });
    return { relationship: relationshipId };
  }

  /**
   * Action: Updates a relationship's name and/or relationshipType.
   * @requires The relationship exists, at least one of name or relationshipType is provided, and if name is provided, no other Relationship owned by the same owner already has that name.
   * @effects Updates the specified properties of the relationship and returns the relationship ID.
   */
  async updateRelationship({
    relationship,
    name,
    relationshipType,
  }: {
    relationship: Relationship;
    name?: string;
    relationshipType?: string;
  }): Promise<{ relationship: Relationship } | { error: string }> {
    if (!name && !relationshipType) {
      return {
        error: "At least one of name or relationshipType must be provided.",
      };
    }

    const existingRelationship = await this.relationships.findOne({
      _id: relationship,
    });
    if (!existingRelationship) {
      return { error: `Relationship with ID ${relationship} not found.` };
    }

    const updateData: Partial<RelationshipDoc> = {};
    if (name !== undefined) {
      if (name.trim() === "") {
        return { error: "Name cannot be empty." };
      }

      // Check for duplicate name only if the name is actually changing
      if (name !== existingRelationship.name) {
        const duplicateRelationship = await this.relationships.findOne({
          owner: existingRelationship.owner,
          name,
        });
        if (duplicateRelationship) {
          return {
            error: `Relationship with name "${name}" already exists for owner ${existingRelationship.owner}.`,
          };
        }
      }
      updateData.name = name;
    }

    if (relationshipType !== undefined) {
      if (relationshipType.trim() === "") {
        return { error: "RelationshipType cannot be empty." };
      }
      updateData.relationshipType = relationshipType;
    }

    await this.relationships.updateOne(
      { _id: relationship },
      { $set: updateData }
    );
    return { relationship };
  }

  /**
   * Action: Deletes a relationship.
   * @requires The relationship exists.
   * @effects Removes the relationship from the set of Relationships.
   */
  async deleteRelationship({
    relationship,
  }: {
    relationship: Relationship;
  }): Promise<Empty | { error: string }> {
    const existingRelationship = await this.relationships.findOne({
      _id: relationship,
    });
    if (!existingRelationship) {
      return { error: `Relationship with ID ${relationship} not found.` };
    }

    await this.relationships.deleteOne({ _id: relationship });
    return {};
  }

  /**
   * Query: Retrieves a relationship by its ID.
   * @requires The relationship exists.
   * @effects Returns the owner, name, and relationshipType of the relationship.
   */
  async _getRelationship({
    relationship,
  }: {
    relationship: Relationship;
  }): Promise<{
    owner: User;
    name: string;
    relationshipType: string;
  } | null> {
    const relationshipDoc = await this.relationships.findOne({
      _id: relationship,
    });
    if (!relationshipDoc) {
      return null;
    }
    return {
      owner: relationshipDoc.owner,
      name: relationshipDoc.name,
      relationshipType: relationshipDoc.relationshipType,
    };
  }

  /**
   * Query: Retrieves all relationships owned by a user.
   * @requires The owner exists.
   * @effects Returns a set of all Relationships owned by the owner, each with its name and relationshipType.
   */
  async _getRelationships({ owner }: { owner: User }): Promise<
    Array<{
      relationship: Relationship;
      name: string;
      relationshipType: string;
    }>
  > {
    const relationships = await this.relationships.find({ owner }).toArray();
    return relationships.map((r) => ({
      relationship: r._id,
      name: r.name,
      relationshipType: r.relationshipType,
    }));
  }

  /**
   * Query: Retrieves a relationship by owner and name.
   * @requires The owner exists, name is not empty, and a Relationship owned by owner with name exists.
   * @effects Returns the Relationship owned by owner with name, and its relationshipType.
   */
  async _getRelationshipByName({
    owner,
    name,
  }: {
    owner: User;
    name: string;
  }): Promise<{ relationship: Relationship; relationshipType: string } | null> {
    if (name.trim() === "") {
      return null;
    }

    const relationshipDoc = await this.relationships.findOne({ owner, name });
    if (!relationshipDoc) {
      return null;
    }
    return {
      relationship: relationshipDoc._id,
      relationshipType: relationshipDoc.relationshipType,
    };
  }
}
