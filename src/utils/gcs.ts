// Load environment variables
import "jsr:@std/dotenv/load";
import { Storage } from "npm:@google-cloud/storage@^7.7.0";

const BUCKET_NAME = Deno.env.get("GCS_BUCKET_NAME") || "momento-memory-images";

// Lazy initialization of GCS client
let storage: Storage | null = null;
let bucket: ReturnType<Storage["bucket"]> | null = null;

// Initialize GCS client with explicit credential handling
function getStorage(): Storage {
  if (storage) {
    return storage;
  }

  const credentialsPath = Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS");
  const credentialsJson = Deno.env.get("GCS_CREDENTIALS_JSON");

  // Option 1: Use service account key file path
  if (credentialsPath) {
    try {
      const credentials = JSON.parse(Deno.readTextFileSync(credentialsPath));
      storage = new Storage({
        projectId: credentials.project_id,
        credentials: credentials,
      });
      bucket = storage.bucket(BUCKET_NAME);
      return storage;
    } catch (error) {
      throw new Error(
        `Failed to load GCS credentials from ${credentialsPath}: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please check that the file exists and is valid JSON.`
      );
    }
  }

  // Option 2: Use inline JSON credentials
  if (credentialsJson) {
    try {
      const credentials = JSON.parse(credentialsJson);
      storage = new Storage({
        projectId: credentials.project_id,
        credentials: credentials,
      });
      bucket = storage.bucket(BUCKET_NAME);
      return storage;
    } catch (error) {
      throw new Error(
        `Failed to parse GCS_CREDENTIALS_JSON: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please check that the JSON is valid.`
      );
    }
  }

  // Option 3: Try Application Default Credentials (for GCP environments)
  // This will work if running on GCP or if gcloud auth application-default login was run
  try {
    storage = new Storage();
    bucket = storage.bucket(BUCKET_NAME);
    return storage;
  } catch (error) {
    throw new Error(
      `GCS credentials not configured. Please set one of the following environment variables:\n` +
        `  1. GOOGLE_APPLICATION_CREDENTIALS - path to service account key JSON file\n` +
        `  2. GCS_CREDENTIALS_JSON - inline JSON credentials (service account key)\n` +
        `  3. Run 'gcloud auth application-default login' for local development\n\n` +
        `Current error: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n` +
        `See: https://cloud.google.com/docs/authentication/getting-started`
    );
  }
}

function getBucket() {
  if (!bucket) {
    getStorage();
  }
  if (!bucket) {
    throw new Error("Failed to initialize GCS bucket");
  }
  return bucket;
}

/**
 * Uploads a file buffer to Google Cloud Storage
 * @param fileBuffer The file buffer to upload
 * @param fileName The name/path for the file in GCS
 * @param contentType The MIME type of the file
 * @returns The public URL of the uploaded file
 */
export async function uploadFileToGCS(
  fileBuffer: Uint8Array,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const bucketInstance = getBucket();
    const blob = bucketInstance.file(fileName);

    await blob.save(fileBuffer, {
      metadata: {
        contentType,
      },
      resumable: false,
    });

    // Try to make the file publicly accessible
    // If uniform bucket-level access is enabled, this will fail but files are already accessible
    // if the bucket itself is public
    try {
      await blob.makePublic();
    } catch (publicError) {
      // If uniform bucket-level access is enabled, we can't set individual object permissions
      // The file will still be accessible if the bucket is public
      if (
        publicError instanceof Error &&
        publicError.message.includes("uniform bucket-level access")
      ) {
        console.log(
          `Note: Uniform bucket-level access is enabled. File will be accessible if bucket is public.`
        );
        // Continue - the file is uploaded and will be accessible if bucket is public
      } else {
        // Re-throw other errors
        throw publicError;
      }
    }

    // Return the public URL
    return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    if (error instanceof Error && error.message.includes("credentials")) {
      throw error; // Re-throw credential errors as-is
    }
    throw new Error(
      `Failed to upload file to GCS: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Deletes a file from Google Cloud Storage
 * @param fileName The name/path of the file in GCS (can be full URL or just the path)
 * @returns true if successful, false otherwise
 */
export async function deleteFileFromGCS(fileName: string): Promise<boolean> {
  try {
    const bucketInstance = getBucket();

    // Extract the file name from URL if a full URL is provided
    let filePath = fileName;
    if (fileName.includes("storage.googleapis.com")) {
      const urlParts = fileName.split("/");
      const bucketIndex = urlParts.findIndex((part) => part === BUCKET_NAME);
      if (bucketIndex !== -1) {
        filePath = urlParts.slice(bucketIndex + 1).join("/");
      }
    }

    const blob = bucketInstance.file(filePath);
    await blob.delete();
    return true;
  } catch (error) {
    console.error(`Error deleting file from GCS: ${error}`);
    return false;
  }
}

/**
 * Generates a unique file name for an uploaded image
 * @param owner The user ID who owns the image
 * @param relationship The relationship ID
 * @param originalFileName The original file name
 * @returns A unique file path
 */
export function generateImageFileName(
  owner: string,
  relationship: string,
  originalFileName: string
): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = originalFileName.split(".").pop() || "jpg";
  return `${owner}/${relationship}/${timestamp}-${randomId}.${extension}`;
}
