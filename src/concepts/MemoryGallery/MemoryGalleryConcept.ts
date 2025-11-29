import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
import {
  uploadFileToGCS,
  deleteFileFromGCS,
  generateImageFileName,
} from "@utils/gcs.ts";

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
   * Action: Uploads an image file to GCS and adds it to the gallery.
   * @requires The user exists, relationship exists, file data is provided, and the file is a valid image.
   * @effects Uploads the file to GCS, creates a new Image entry with the GCS URL, sets uploadDate to current time, and returns the uploadDate and imageUrl.
   */
  async uploadImage({
    owner,
    relationship,
    fileData,
    fileName,
    contentType,
  }: {
    owner: User;
    relationship: Relationship;
    fileData: Uint8Array;
    fileName: string;
    contentType: string;
  }): Promise<{ uploadDate: Date; imageUrl: string } | { error: string }> {
    if (!fileData || fileData.length === 0) {
      return { error: "File data cannot be empty." };
    }

    if (!contentType || !contentType.startsWith("image/")) {
      return { error: "File must be an image." };
    }

    // Normalize owner and relationship to handle any encoding issues
    const normalizedOwner = (
      typeof owner === "string"
        ? owner.trim().replace(/^["']|["']$/g, "")
        : owner
    ) as User;
    const normalizedRelationship = (
      typeof relationship === "string"
        ? relationship.trim().replace(/^["']|["']$/g, "")
        : relationship
    ) as Relationship;

    try {
      // Generate a unique file name for GCS
      const gcsFileName = generateImageFileName(
        normalizedOwner,
        normalizedRelationship,
        fileName
      );

      // Upload to GCS
      const imageUrl = await uploadFileToGCS(
        fileData,
        gcsFileName,
        contentType
      );

      // Check if this URL already exists for this owner
      const existingImage = await this.images.findOne({
        owner: normalizedOwner,
        imageUrl,
      });
      if (existingImage) {
        // If it exists, delete the file we just uploaded
        await deleteFileFromGCS(imageUrl);
        return {
          error: `Image with URL "${imageUrl}" already exists in the gallery for owner ${normalizedOwner}.`,
        };
      }

      const uploadDate = new Date();
      const imageId = freshID() as Image;
      await this.images.insertOne({
        _id: imageId,
        owner: normalizedOwner,
        relationship: normalizedRelationship,
        imageUrl,
        uploadDate,
      });
      return { uploadDate, imageUrl };
    } catch (error) {
      console.error("Error uploading image to GCS:", error);
      return {
        error: `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Action: Adds a new image to the gallery using an existing URL.
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
   * Action: Removes an image from the gallery and deletes it from GCS.
   * @requires The user exists, an Image with imageUrl exists, and the owner of that Image is the given owner.
   * @effects Deletes the Image with the given imageUrl from the gallery and from GCS (if it's a GCS URL).
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

    // Delete from MongoDB first
    await this.images.deleteOne({ owner, imageUrl });

    // If it's a GCS URL, delete from GCS as well
    if (imageUrl.includes("storage.googleapis.com")) {
      try {
        await deleteFileFromGCS(imageUrl);
      } catch (error) {
        // Log error but don't fail the request if GCS deletion fails
        console.error(`Failed to delete image from GCS: ${error}`);
      }
    }

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
    // Normalize owner to handle any encoding issues
    const normalizedOwner = (
      typeof owner === "string"
        ? owner.trim().replace(/^["']|["']$/g, "")
        : owner
    ) as User;
    const images = await this.images.find({ owner: normalizedOwner }).toArray();
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
    // Normalize owner and relationship to handle any encoding issues
    const normalizedOwner = (
      typeof owner === "string"
        ? owner.trim().replace(/^["']|["']$/g, "")
        : owner
    ) as User;
    const normalizedRelationship = (
      typeof relationship === "string"
        ? relationship.trim().replace(/^["']|["']$/g, "")
        : relationship
    ) as Relationship;
    const images = await this.images
      .find({
        owner: normalizedOwner,
        relationship: normalizedRelationship,
      })
      .toArray();
    return images.map((img) => ({
      imageUrl: img.imageUrl,
      uploadDate: img.uploadDate,
    }));
  }
}
