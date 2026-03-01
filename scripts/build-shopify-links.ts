/**
 * build-shopify-links.ts
 *
 * Reads the Printify upload tracker and the artwork catalog to build a
 * mapping of artwork IDs to their Shopify product URLs. Artworks without
 * a successful Printify upload receive a fallback link to the store homepage.
 *
 * Run: tsx scripts/build-shopify-links.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PRINTIFY_TRACKER_PATH =
  "/Users/rebelhawk/Documents/Claude/pod-design-generator/uploaded_printify.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const CATALOG_PATH = path.join(PROJECT_ROOT, "src", "data", "catalog.json");
const OUTPUT_PATH = path.join(PROJECT_ROOT, "src", "data", "shopify-links.json");

const PHASE_1_POSTERS =
  "/Users/rebelhawk/Documents/Claude/landmark-style-transfer/output/poster";
const PHASE_2_POSTERS =
  "/Users/rebelhawk/Documents/Claude/landmark-style-transfer-phase2/output/poster";

const SHOPIFY_BASE = "https://moderndesignconcept.com";
const FALLBACK_URL = SHOPIFY_BASE;

// Known styles for filename parsing
const KNOWN_STYLES = [
  "cafe_terrace",
  "composition_vii",
  "great_wave",
  "starry_night",
  "the_scream",
  "water_lilies",
] as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PrintifyEntry {
  status: string;
  timestamp: string;
  product_id: string;
  error: string | null;
}

interface CatalogArtwork {
  id: string;
  title: string;
}

interface Catalog {
  artworks: CatalogArtwork[];
}

interface MetadataJson {
  title: string;
  description: string;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a product title to a Shopify URL slug.
 * Lowercases, replaces spaces with hyphens, strips non-alphanumeric chars
 * (except hyphens), collapses multiple hyphens, trims leading/trailing hyphens.
 */
function toShopifySlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Parse a poster filename to extract the artwork ID (landmark_style).
 */
function parseFilename(filename: string): string | null {
  const base = filename.replace(/_poster\.\w+$/, "");
  for (const style of KNOWN_STYLES) {
    if (base.endsWith(`_${style}`)) {
      const landmark = base.slice(0, -(style.length + 1));
      return `${landmark}_${style}`;
    }
  }
  return null;
}

/**
 * Build a title map from the catalog.json or from metadata JSONs directly.
 * Returns a Map<artworkId, title>.
 */
function buildTitleMap(): Map<string, string> {
  const titleMap = new Map<string, string>();

  // Try catalog.json first
  if (fs.existsSync(CATALOG_PATH)) {
    console.log("Reading titles from catalog.json...");
    const raw = fs.readFileSync(CATALOG_PATH, "utf-8");
    const catalog: Catalog = JSON.parse(raw);
    for (const artwork of catalog.artworks) {
      titleMap.set(artwork.id, artwork.title);
    }
    console.log(`  Found ${titleMap.size} titles in catalog\n`);
    return titleMap;
  }

  // Fallback: read metadata JSONs directly from source directories
  console.log("catalog.json not found, reading metadata JSONs directly...");

  for (const dir of [PHASE_1_POSTERS, PHASE_2_POSTERS]) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith("_poster.json"));
    for (const file of files) {
      const artworkId = parseFilename(file);
      if (!artworkId) continue;
      if (artworkId.startsWith("test_landmark")) continue;

      const jsonPath = path.join(dir, file);
      const meta: MetadataJson = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      titleMap.set(artworkId, meta.title);
    }
  }

  console.log(`  Found ${titleMap.size} titles from metadata JSONs\n`);
  return titleMap;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const startTime = Date.now();
  console.log("=== Build Shopify Links ===\n");

  // 1. Load Printify tracker
  console.log("Reading Printify tracker...");
  if (!fs.existsSync(PRINTIFY_TRACKER_PATH)) {
    console.error(`Printify tracker not found: ${PRINTIFY_TRACKER_PATH}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(PRINTIFY_TRACKER_PATH, "utf-8");
  const tracker: Record<string, PrintifyEntry> = JSON.parse(raw);

  // 2. Extract successful poster uploads and map artworkId -> key
  // Keys look like: "printify:ext:output/poster/angkor_wat_cafe_terrace"
  const printifyIds = new Map<string, string>(); // artworkId -> printifyKey
  let successCount = 0;
  let totalPosterKeys = 0;

  for (const [key, entry] of Object.entries(tracker)) {
    // Only consider poster entries
    if (!key.includes("/poster/")) continue;
    totalPosterKeys++;

    if (entry.status !== "success") continue;
    successCount++;

    // Extract artwork slug from the key (everything after last "/")
    const slug = key.split("/").pop();
    if (slug) {
      printifyIds.set(slug, key);
    }
  }

  console.log(`  Total poster keys: ${totalPosterKeys}`);
  console.log(`  Successful uploads: ${successCount}\n`);

  // 3. Build title map
  const titleMap = buildTitleMap();

  // 4. Build the shopify-links mapping
  const shopifyLinks: Record<string, string> = {};
  let matchCount = 0;
  let fallbackCount = 0;

  // Get all artwork IDs from the title map (our source of truth for which artworks exist)
  for (const [artworkId, title] of titleMap) {
    if (printifyIds.has(artworkId)) {
      // This artwork was successfully uploaded to Printify -> has a Shopify product
      const slug = toShopifySlug(title);
      shopifyLinks[artworkId] = `${SHOPIFY_BASE}/products/${slug}`;
      matchCount++;
    } else {
      // No Printify match -> fallback to store homepage
      shopifyLinks[artworkId] = FALLBACK_URL;
      fallbackCount++;
    }
  }

  // 5. Write output
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(shopifyLinks, null, 2));

  console.log(`Shopify links written: ${OUTPUT_PATH}`);
  console.log(`  Matched (with product URL): ${matchCount}`);
  console.log(`  Fallback (store homepage):  ${fallbackCount}`);
  console.log(`  Total:                      ${matchCount + fallbackCount}\n`);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`=== Done in ${elapsed}s ===`);
}

main();
