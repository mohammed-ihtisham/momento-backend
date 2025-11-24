import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Occasion" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type Occasion = ID;

/**
 * State: A set of Occasions with an owner, person, occasionType, and date.
 */
interface OccasionDoc {
  _id: Occasion;
  owner: User;
  person: string;
  occasionType: string;
  date: string; // ISO 8601 Date string
}

/**
 * Validates if a string is a valid ISO 8601 date string.
 */
function isValidISO8601Date(dateString: string): boolean {
  if (dateString.trim() === "") {
    return false;
  }
  const date = new Date(dateString);
  // Check if date is valid and the string can be parsed
  if (isNaN(date.getTime())) {
    return false;
  }
  // Check if the date string matches ISO 8601 format (basic validation)
  // This ensures the string can be properly parsed and represents a valid date
  return (
    date.toISOString().startsWith(dateString.substring(0, 10)) ||
    dateString === date.toISOString()
  );
}

/**
 * @concept Occasion
 * @purpose define a specific event or occasion with minimal information: person, occasion type, and date
 */
export default class OccasionConcept {
  occasions: Collection<OccasionDoc>;

  constructor(private readonly db: Db) {
    this.occasions = this.db.collection(PREFIX + "occasions");
  }

  /**
   * Action: Creates a new occasion for an owner.
   * @requires The user exists, person is not empty, occasionType is not empty, and date is a valid ISO 8601 Date string.
   * @effects A new occasion is created with the given owner, person, occasionType, and date, and its ID is returned.
   */
  async createOccasion({
    owner,
    person,
    occasionType,
    date,
  }: {
    owner: User;
    person: string;
    occasionType: string;
    date: string;
  }): Promise<{ occasion: Occasion } | { error: string }> {
    if (person.trim() === "") {
      return { error: "Person cannot be empty." };
    }

    if (occasionType.trim() === "") {
      return { error: "OccasionType cannot be empty." };
    }

    if (!isValidISO8601Date(date)) {
      return { error: "Date must be a valid ISO 8601 date string." };
    }

    const occasionId = freshID() as Occasion;
    await this.occasions.insertOne({
      _id: occasionId,
      owner,
      person,
      occasionType,
      date,
    });
    return { occasion: occasionId };
  }

  /**
   * Action: Updates an occasion's person, occasionType, and/or date.
   * @requires The occasion exists, at least one of person, occasionType, or date is provided, and if date is provided, it is a valid ISO 8601 Date string.
   * @effects Updates the specified properties of the occasion and returns the occasion ID.
   */
  async updateOccasion({
    occasion,
    person,
    occasionType,
    date,
  }: {
    occasion: Occasion;
    person?: string;
    occasionType?: string;
    date?: string;
  }): Promise<{ occasion: Occasion } | { error: string }> {
    if (!person && !occasionType && !date) {
      return {
        error:
          "At least one of person, occasionType, or date must be provided.",
      };
    }

    const existingOccasion = await this.occasions.findOne({ _id: occasion });
    if (!existingOccasion) {
      return { error: `Occasion with ID ${occasion} not found.` };
    }

    const updateData: Partial<OccasionDoc> = {};
    if (person !== undefined) {
      if (person.trim() === "") {
        return { error: "Person cannot be empty." };
      }
      updateData.person = person;
    }

    if (occasionType !== undefined) {
      if (occasionType.trim() === "") {
        return { error: "OccasionType cannot be empty." };
      }
      updateData.occasionType = occasionType;
    }

    if (date !== undefined) {
      if (!isValidISO8601Date(date)) {
        return { error: "Date must be a valid ISO 8601 date string." };
      }
      updateData.date = date;
    }

    await this.occasions.updateOne({ _id: occasion }, { $set: updateData });
    return { occasion };
  }

  /**
   * Action: Deletes an occasion.
   * @requires The occasion exists.
   * @effects Removes the occasion from the set of Occasions.
   */
  async deleteOccasion({
    occasion,
  }: {
    occasion: Occasion;
  }): Promise<Empty | { error: string }> {
    const existingOccasion = await this.occasions.findOne({ _id: occasion });
    if (!existingOccasion) {
      return { error: `Occasion with ID ${occasion} not found.` };
    }

    await this.occasions.deleteOne({ _id: occasion });
    return {};
  }

  /**
   * Query: Retrieves an occasion by its ID.
   * @requires The occasion exists.
   * @effects Returns the owner, person, occasionType, and date of the occasion.
   */
  async _getOccasion({ occasion }: { occasion: Occasion }): Promise<{
    owner: User;
    person: string;
    occasionType: string;
    date: string;
  } | null> {
    const occasionDoc = await this.occasions.findOne({ _id: occasion });
    if (!occasionDoc) {
      return null;
    }
    return {
      owner: occasionDoc.owner,
      person: occasionDoc.person,
      occasionType: occasionDoc.occasionType,
      date: occasionDoc.date,
    };
  }

  /**
   * Query: Retrieves all occasions owned by a user.
   * @requires The owner exists.
   * @effects Returns a set of all Occasions owned by the owner, each with its person, occasionType, and date.
   */
  async _getOccasions({ owner }: { owner: User }): Promise<
    Array<{
      occasion: Occasion;
      person: string;
      occasionType: string;
      date: string;
    }>
  > {
    const occasions = await this.occasions.find({ owner }).toArray();
    return occasions.map((o) => ({
      occasion: o._id,
      person: o.person,
      occasionType: o.occasionType,
      date: o.date,
    }));
  }

  /**
   * Query: Retrieves all occasions owned by a user for a specific person.
   * @requires The owner exists and person is not empty.
   * @effects Returns a set of all Occasions owned by the owner for the given person, each with its occasionType and date.
   */
  async _getOccasionsByPerson({
    owner,
    person,
  }: {
    owner: User;
    person: string;
  }): Promise<
    Array<{
      occasion: Occasion;
      occasionType: string;
      date: string;
    }>
  > {
    if (person.trim() === "") {
      return [];
    }

    const occasions = await this.occasions.find({ owner, person }).toArray();
    return occasions.map((o) => ({
      occasion: o._id,
      occasionType: o.occasionType,
      date: o.date,
    }));
  }

  /**
   * Query: Retrieves all occasions owned by a user with a specific date.
   * @requires The owner exists and date is a valid ISO 8601 Date string.
   * @effects Returns a set of all Occasions owned by the owner with the given date, each with its person and occasionType.
   */
  async _getOccasionsByDate({
    owner,
    date,
  }: {
    owner: User;
    date: string;
  }): Promise<
    Array<{
      occasion: Occasion;
      person: string;
      occasionType: string;
    }>
  > {
    if (!isValidISO8601Date(date)) {
      return [];
    }

    const occasions = await this.occasions.find({ owner, date }).toArray();
    return occasions.map((o) => ({
      occasion: o._id,
      person: o.person,
      occasionType: o.occasionType,
    }));
  }
}
