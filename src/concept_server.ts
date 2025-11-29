import { Hono } from "jsr:@hono/hono";
import { getDb } from "@utils/database.ts";
import { walk } from "jsr:@std/fs";
import { parseArgs } from "jsr:@std/cli/parse-args";
import { toFileUrl } from "jsr:@std/path/to-file-url";

// Parse command-line arguments for port and base URL
const flags = parseArgs(Deno.args, {
  string: ["port", "baseUrl"],
  default: {
    port: "8000",
    baseUrl: "/api",
  },
});

const PORT = parseInt(flags.port, 10);
const BASE_URL = flags.baseUrl;
const CONCEPTS_DIR = "src/concepts";

/**
 * Main server function to initialize DB, load concepts, and start the server.
 */
async function main() {
  const [db] = await getDb();
  const app = new Hono();

  app.get("/", (c) => c.text("Concept Server is running."));

  // --- Dynamic Concept Loading and Routing ---
  console.log(`Scanning for concepts in ./${CONCEPTS_DIR}...`);

  for await (const entry of walk(CONCEPTS_DIR, {
    maxDepth: 1,
    includeDirs: true,
    includeFiles: false,
  })) {
    if (entry.path === CONCEPTS_DIR) continue; // Skip the root directory

    const conceptName = entry.name;
    const conceptFilePath = `${entry.path}/${conceptName}Concept.ts`;

    try {
      const modulePath = toFileUrl(Deno.realPathSync(conceptFilePath)).href;
      const module = await import(modulePath);
      const ConceptClass = module.default;

      if (
        typeof ConceptClass !== "function" ||
        !ConceptClass.name.endsWith("Concept")
      ) {
        console.warn(
          `! No valid concept class found in ${conceptFilePath}. Skipping.`
        );
        continue;
      }

      const instance = new ConceptClass(db);
      const conceptApiName = conceptName;
      console.log(
        `- Registering concept: ${conceptName} at ${BASE_URL}/${conceptApiName}`
      );

      const methodNames = Object.getOwnPropertyNames(
        Object.getPrototypeOf(instance)
      ).filter(
        (name) => name !== "constructor" && typeof instance[name] === "function"
      );

      for (const methodName of methodNames) {
        const actionName = methodName;
        const route = `${BASE_URL}/${conceptApiName}/${actionName}`;

        // Special handling for MemoryGallery.uploadImage to handle file uploads
        if (conceptName === "MemoryGallery" && methodName === "uploadImage") {
          app.post(route, async (c) => {
            try {
              const contentType = c.req.header("content-type") || "";

              if (contentType.includes("multipart/form-data")) {
                // Handle file upload
                const formData = await c.req.formData();
                const file = formData.get("file") as File | null;
                let owner = formData.get("owner") as string;
                let relationship = formData.get("relationship") as string;

                if (!file) {
                  return c.json({ error: "No file provided." }, 400);
                }
                if (!owner) {
                  return c.json({ error: "Owner is required." }, 400);
                }
                if (!relationship) {
                  return c.json({ error: "Relationship is required." }, 400);
                }

                // Normalize owner and relationship by removing quotes and trimming
                // This handles cases where values might be JSON-encoded strings
                owner = owner.trim().replace(/^["']|["']$/g, "");
                relationship = relationship.trim().replace(/^["']|["']$/g, "");

                // Convert File to Uint8Array
                const fileData = new Uint8Array(await file.arrayBuffer());

                const result = await instance[methodName]({
                  owner,
                  relationship,
                  fileData,
                  fileName: file.name,
                  contentType: file.type,
                });
                return c.json(result);
              } else {
                // Fallback to JSON handling for backward compatibility
                const body = await c.req.json().catch(() => ({}));
                const result = await instance[methodName](body);
                return c.json(result);
              }
            } catch (e) {
              console.error(`Error in ${conceptName}.${methodName}:`, e);
              return c.json(
                { error: "An internal server error occurred." },
                500
              );
            }
          });
          console.log(
            `  - Endpoint: POST ${route} (multipart/form-data supported)`
          );
        } else {
          // Standard JSON endpoint
          app.post(route, async (c) => {
            try {
              const body = await c.req.json().catch(() => ({})); // Handle empty body
              const result = await instance[methodName](body);
              return c.json(result);
            } catch (e) {
              console.error(`Error in ${conceptName}.${methodName}:`, e);
              return c.json(
                { error: "An internal server error occurred." },
                500
              );
            }
          });
          console.log(`  - Endpoint: POST ${route}`);
        }
      }
    } catch (e) {
      console.error(`! Error loading concept from ${conceptFilePath}:`, e);
    }
  }

  console.log(`\nServer listening on http://localhost:${PORT}`);
  Deno.serve({ port: PORT }, app.fetch);
}

// Run the server
main();
