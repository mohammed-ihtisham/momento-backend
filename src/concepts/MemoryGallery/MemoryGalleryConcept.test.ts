import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import MemoryGalleryConcept from "./MemoryGalleryConcept.ts";

const ownerA = "user:Alice" as ID;
const relationship1 = "relationship:1" as ID;
const relationship2 = "relationship:2" as ID;

Deno.test("Principle: User adds image, can view all images, filter by relationship, and remove", async () => {
  const [db, client] = await testDb();
  const galleryConcept = new MemoryGalleryConcept(db);

  try {
    // 1. User adds an image
    const addResult = await galleryConcept.addImage({
      owner: ownerA,
      relationship: relationship1,
      imageUrl: "https://example.com/image1.jpg",
    });
    assertNotEquals(
      "error" in addResult,
      true,
      "Adding image should not fail.",
    );
    const { uploadDate } = addResult as { uploadDate: Date };
    assertExists(uploadDate);
    assertExists(uploadDate instanceof Date, "uploadDate should be a Date.");

    // 2. User can view all their images
    const allImages = await galleryConcept._getImages({ owner: ownerA });
    assertEquals(allImages.length, 1, "Should have one image.");
    assertEquals(
      allImages[0].imageUrl,
      "https://example.com/image1.jpg",
      "Image URL should match.",
    );

    // 3. User can filter by relationship
    const imagesByRel = await galleryConcept._getImagesByRelationship({
      owner: ownerA,
      relationship: relationship1,
    });
    assertEquals(
      imagesByRel.length,
      1,
      "Should find one image for relationship.",
    );

    // 4. User can remove the image
    const removeResult = await galleryConcept.removeImage({
      owner: ownerA,
      imageUrl: "https://example.com/image1.jpg",
    });
    assertEquals("error" in removeResult, false, "Remove should succeed.");

    const imagesAfterRemove = await galleryConcept._getImages({ owner: ownerA });
    assertEquals(
      imagesAfterRemove.length,
      0,
      "Should have no images after removal.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: addImage requires non-empty imageUrl and unique URL per owner", async () => {
  const [db, client] = await testDb();
  const galleryConcept = new MemoryGalleryConcept(db);

  try {
    // Requires: imageUrl is not empty
    const emptyUrlResult = await galleryConcept.addImage({
      owner: ownerA,
      relationship: relationship1,
      imageUrl: "",
    });
    assertEquals(
      "error" in emptyUrlResult,
      true,
      "Adding empty imageUrl should fail.",
    );

    // Requires: imageUrl not already in owner's gallery
    await galleryConcept.addImage({
      owner: ownerA,
      relationship: relationship1,
      imageUrl: "https://example.com/image1.jpg",
    });
    const duplicateResult = await galleryConcept.addImage({
      owner: ownerA,
      relationship: relationship2,
      imageUrl: "https://example.com/image1.jpg",
    });
    assertEquals(
      "error" in duplicateResult,
      true,
      "Adding duplicate imageUrl for same owner should fail.",
    );

    // Different owners can have same imageUrl
    const differentOwnerResult = await galleryConcept.addImage({
      owner: "user:Bob" as ID,
      relationship: relationship1,
      imageUrl: "https://example.com/image1.jpg",
    });
    assertEquals(
      "error" in differentOwnerResult,
      false,
      "Different owners can have same imageUrl.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: removeImage requires existing image for owner", async () => {
  const [db, client] = await testDb();
  const galleryConcept = new MemoryGalleryConcept(db);

  try {
    // Remove non-existent should fail
    const removeResult = await galleryConcept.removeImage({
      owner: ownerA,
      imageUrl: "https://example.com/nonexistent.jpg",
    });
    assertEquals(
      "error" in removeResult,
      true,
      "Removing non-existent image should fail.",
    );

    // Add and remove
    await galleryConcept.addImage({
      owner: ownerA,
      relationship: relationship1,
      imageUrl: "https://example.com/image1.jpg",
    });
    const successResult = await galleryConcept.removeImage({
      owner: ownerA,
      imageUrl: "https://example.com/image1.jpg",
    });
    assertEquals(
      "error" in successResult,
      false,
      "Removing existing image should succeed.",
    );

    // Verify removal
    const images = await galleryConcept._getImages({ owner: ownerA });
    assertEquals(images.length, 0, "Should have no images after removal.");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getImagesByRelationship filters correctly", async () => {
  const [db, client] = await testDb();
  const galleryConcept = new MemoryGalleryConcept(db);

  try {
    await galleryConcept.addImage({
      owner: ownerA,
      relationship: relationship1,
      imageUrl: "https://example.com/image1.jpg",
    });
    await galleryConcept.addImage({
      owner: ownerA,
      relationship: relationship1,
      imageUrl: "https://example.com/image2.jpg",
    });
    await galleryConcept.addImage({
      owner: ownerA,
      relationship: relationship2,
      imageUrl: "https://example.com/image3.jpg",
    });

    const rel1Images = await galleryConcept._getImagesByRelationship({
      owner: ownerA,
      relationship: relationship1,
    });
    assertEquals(
      rel1Images.length,
      2,
      "Should return 2 images for relationship1.",
    );

    const rel2Images = await galleryConcept._getImagesByRelationship({
      owner: ownerA,
      relationship: relationship2,
    });
    assertEquals(
      rel2Images.length,
      1,
      "Should return 1 image for relationship2.",
    );
  } finally {
    await client.close();
  }
});

