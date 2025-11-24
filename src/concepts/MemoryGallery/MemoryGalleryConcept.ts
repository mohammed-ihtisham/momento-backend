import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "MemoryGallery" + ".";

// Generic types for the concept's external dependencies
type User = ID;
type Relationship = ID;

// Internal entity types, represented as IDs
type Image = ID;

/**
 * State: A set of Images with an owner, relationship, imageUrl, and uploadDate.
 */
interface ImageDoc {
  _id: Image;
  owner: User;
  relationship: Relationship;
  imageUrl: string;
  uploadDate: Date;
}

/**
 * @concept MemoryGallery
 * @purpose store a list of images associated with relationships the user has
 */
export default class MemoryGalleryConcept {
  images: Collection<ImageDoc>;

  constructor(private readonly db: Db) {
    this.images = this.db.collection(PREFIX + "images");
  }

  /**
   * Action: Adds a new image to the gallery.
   * @requires The user exists, relationship exists, imageUrl is not empty, and imageUrl is not already in the owner's gallery.
   * @effects Creates a new Image entry with the given owner, relationship, and imageUrl, sets uploadDate to current time, and returns the uploadDate.
   */
  async addImage({
    owner,
    relationship,
    imageUrl,
  }: {
    owner: User;
    relationship: Relationship;
    imageUrl: string;
  }): Promise<{ uploadDate: Date } | { error: string }> {
    if (imageUrl.trim() === "") {
      return { error: "ImageUrl cannot be empty." };
    }

    const existingImage = await this.images.findOne({
      owner,
      imageUrl,
    });
    if (existingImage) {
      return {
        error: `Image with URL "${imageUrl}" already exists in the gallery for owner ${owner}.`,
      };
    }

    const uploadDate = new Date();
    const imageId = freshID() as Image;
    await this.images.insertOne({
      _id: imageId,
      owner,
      relationship,
      imageUrl,
      uploadDate,
    });
    return { uploadDate };
  }

  /**
   * Action: Removes an image from the gallery.
   * @requires The user exists, an Image with imageUrl exists, and the owner of that Image is the given owner.
   * @effects Deletes the Image with the given imageUrl from the gallery.
   */
  async removeImage({
    owner,
    imageUrl,
  }: {
    owner: User;
    imageUrl: string;
  }): Promise<Empty | { error: string }> {
    const existingImage = await this.images.findOne({
      owner,
      imageUrl,
    });
    if (!existingImage) {
      return {
        error: `Image with URL "${imageUrl}" not found in the gallery for owner ${owner}.`,
      };
    }

    await this.images.deleteOne({ owner, imageUrl });
    return {};
  }

  /**
   * Query: Retrieves all images owned by a user.
   * @requires The owner exists.
   * @effects Returns all images where owner is the given owner, along with their associated relationship and uploadDate.
   */
  async _getImages({ owner }: { owner: User }): Promise<
    Array<{
      imageUrl: string;
      relationship: Relationship;
      uploadDate: Date;
    }>
  > {
    const images = await this.images.find({ owner }).toArray();
    return images.map((img) => ({
      imageUrl: img.imageUrl,
      relationship: img.relationship,
      uploadDate: img.uploadDate,
    }));
  }

  /**
   * Query: Retrieves all images owned by a user for a specific relationship.
   * @requires The owner exists and relationship exists.
   * @effects Returns all images where owner is the given owner and relationship is the given relationship, along with their uploadDate.
   */
  async _getImagesByRelationship({
    owner,
    relationship,
  }: {
    owner: User;
    relationship: Relationship;
  }): Promise<
    Array<{
      imageUrl: string;
      uploadDate: Date;
    }>
  > {
    const images = await this.images.find({ owner, relationship }).toArray();
    return images.map((img) => ({
      imageUrl: img.imageUrl,
      uploadDate: img.uploadDate,
    }));
  }
}
