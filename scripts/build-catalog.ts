/**
 * build-catalog.ts
 *
 * Processes 300 neural style-transferred landmark artworks (50 landmarks x 6 styles)
 * plus 50 original landmark photos. Generates optimized WebP images in three tiers
 * (thumb/medium/full), blur placeholders, a JSON catalog, and a sitemap.
 *
 * Run: tsx scripts/build-catalog.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PHASE_1_POSTERS = "/Users/rebelhawk/Documents/Claude/landmark-style-transfer/output/poster";
const PHASE_2_POSTERS = "/Users/rebelhawk/Documents/Claude/landmark-style-transfer-phase2/output/poster";
const PHASE_1_ORIGINALS = "/Users/rebelhawk/Documents/Claude/landmark-style-transfer/content";
const PHASE_2_ORIGINALS = "/Users/rebelhawk/Documents/Claude/landmark-style-transfer-phase2/content";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");
const ARTWORKS_DIR = path.join(IMAGES_DIR, "artworks");
const ORIGINALS_DIR = path.join(IMAGES_DIR, "originals");
const CATALOG_PATH = path.join(PROJECT_ROOT, "src", "data", "catalog.json");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");

const BASE_URL = "https://rebelhawk-tk.github.io/ai-art-gallery";

const KNOWN_STYLES = [
  "cafe_terrace",
  "composition_vii",
  "great_wave",
  "starry_night",
  "the_scream",
  "water_lilies",
] as const;

// Phase 1 landmarks (exclude test_landmark)
const PHASE_1_LANDMARKS = [
  "angkor_wat", "big_ben", "chichen_itza", "christ_redeemer", "colosseum",
  "eiffel_tower", "golden_gate", "great_wall", "hagia_sophia", "machu_picchu",
  "moai", "mount_fuji", "neuschwanstein", "notre_dame", "parthenon",
  "petra", "pyramids_giza", "sagrada_familia", "santorini", "st_basils",
  "statue_of_liberty", "stonehenge", "sydney_opera", "taj_mahal", "tower_of_pisa",
];

const PHASE_2_LANDMARKS = [
  "amsterdam_canals", "bagan_temples", "bruges_medieval", "charles_bridge",
  "chefchaouen", "edinburgh_old_town", "fushimi_inari", "giants_causeway",
  "guanajuato", "hallgrimskirkja", "hapenny_bridge", "havana_vieja",
  "hawa_mahal", "hoi_an", "milford_sound", "mont_saint_michel", "moraine_lake",
  "nyhavn", "plitvice_lakes", "ponte_vecchio", "rialto_bridge", "rijksmuseum",
  "temple_bar", "twelve_apostles", "zanzibar_stone_town",
];

const CONCURRENCY_LIMIT = 8;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MetadataJson {
  title: string;
  description: string;
  tags: string[];
}

interface ArtworkImages {
  thumb: string;
  medium: string;
  full: string;
  blurDataUrl: string;
}

interface OriginalImages {
  thumb: string;
  medium: string;
  blurDataUrl: string;
}

interface ArtworkEntry {
  id: string;
  landmark: string;
  style: string;
  title: string;
  description: string;
  tags: string[];
  images: ArtworkImages;
  original: OriginalImages;
  phase: 1 | 2;
}

interface ArtworkCatalog {
  generatedAt: string;
  totalArtworks: number;
  totalLandmarks: number;
  totalStyles: number;
  artworks: ArtworkEntry[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse a poster filename to extract landmark and style.
 * E.g. "angkor_wat_starry_night_poster.png" -> { landmark: "angkor_wat", style: "starry_night" }
 *
 * Strategy: strip "_poster" suffix, then check which known style suffix the
 * basename ends with. Everything before that suffix is the landmark slug.
 */
function parseFilename(filename: string): { landmark: string; style: string } | null {
  const base = filename.replace(/_poster\.\w+$/, "");
  for (const style of KNOWN_STYLES) {
    if (base.endsWith(`_${style}`)) {
      const landmark = base.slice(0, -(style.length + 1)); // +1 for the underscore
      return { landmark, style };
    }
  }
  return null;
}

/**
 * Returns true if `outputPath` exists and is newer than `sourcePath`.
 */
function isUpToDate(outputPath: string, sourcePath: string): boolean {
  try {
    const outStat = fs.statSync(outputPath);
    const srcStat = fs.statSync(sourcePath);
    return outStat.mtimeMs >= srcStat.mtimeMs;
  } catch {
    return false;
  }
}

/**
 * Generate a tiny 16px-wide base64 WebP blur placeholder.
 */
async function generateBlurPlaceholder(sourcePath: string): Promise<string> {
  const buffer = await sharp(sourcePath)
    .resize(16)
    .webp({ quality: 20 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString("base64")}`;
}

/**
 * Resize an image to `width` px wide, output as WebP with given quality.
 * Skips if the output already exists and is newer than the source.
 */
async function resizeImage(
  sourcePath: string,
  outputPath: string,
  width: number,
  quality: number
): Promise<void> {
  if (isUpToDate(outputPath, sourcePath)) {
    return;
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await sharp(sourcePath)
    .resize(width)
    .webp({ quality })
    .toFile(outputPath);
}

/**
 * Simple concurrency limiter: run an array of async tasks with at most
 * `limit` running at a time.
 */
async function parallelLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < tasks.length) {
      const idx = nextIndex++;
      results[idx] = await tasks[idx]();
    }
  }

  const workers: Promise<void>[] = [];
  for (let i = 0; i < Math.min(limit, tasks.length); i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// Core Processing
// ---------------------------------------------------------------------------

interface PosterSource {
  pngPath: string;
  jsonPath: string;
  landmark: string;
  style: string;
  phase: 1 | 2;
}

/**
 * Scan a poster directory and return all valid sources.
 */
function scanPosters(dir: string, phase: 1 | 2): PosterSource[] {
  const sources: PosterSource[] = [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith("_poster.png"));
  for (const file of files) {
    const parsed = parseFilename(file);
    if (!parsed) {
      console.warn(`  [WARN] Could not parse filename: ${file}`);
      continue;
    }
    // Skip test_landmark
    if (parsed.landmark === "test_landmark") continue;
    const pngPath = path.join(dir, file);
    const jsonPath = pngPath.replace(/\.png$/, ".json");
    if (!fs.existsSync(jsonPath)) {
      console.warn(`  [WARN] Missing metadata JSON for: ${file}`);
      continue;
    }
    sources.push({ pngPath, jsonPath, landmark: parsed.landmark, style: parsed.style, phase });
  }
  return sources;
}

/**
 * Process a single styled artwork: generate thumb, medium, full images + blur.
 * Returns the ArtworkImages paths (relative from public/).
 */
async function processArtworkImages(src: PosterSource): Promise<ArtworkImages> {
  const outDir = path.join(ARTWORKS_DIR, src.landmark, src.style);
  const thumbPath = path.join(outDir, "thumb.webp");
  const mediumPath = path.join(outDir, "medium.webp");
  const fullPath = path.join(outDir, "full.webp");

  await resizeImage(src.pngPath, thumbPath, 400, 75);
  await resizeImage(src.pngPath, mediumPath, 800, 82);
  await resizeImage(src.pngPath, fullPath, 1600, 88);

  const blurDataUrl = await generateBlurPlaceholder(src.pngPath);

  return {
    thumb: `/images/artworks/${src.landmark}/${src.style}/thumb.webp`,
    medium: `/images/artworks/${src.landmark}/${src.style}/medium.webp`,
    full: `/images/artworks/${src.landmark}/${src.style}/full.webp`,
    blurDataUrl,
  };
}

interface OriginalSource {
  jpgPath: string;
  landmark: string;
  phase: 1 | 2;
}

/**
 * Scan an originals directory.
 */
function scanOriginals(dir: string, phase: 1 | 2, validLandmarks: string[]): OriginalSource[] {
  const sources: OriginalSource[] = [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jpg"));
  for (const file of files) {
    const landmark = file.replace(/\.jpg$/, "");
    if (!validLandmarks.includes(landmark)) continue;
    sources.push({ jpgPath: path.join(dir, file), landmark, phase });
  }
  return sources;
}

/**
 * Process a single original photo: generate thumb, medium + blur.
 */
async function processOriginalImages(src: OriginalSource): Promise<OriginalImages> {
  const outDir = path.join(ORIGINALS_DIR, src.landmark);
  const thumbPath = path.join(outDir, "thumb.webp");
  const mediumPath = path.join(outDir, "medium.webp");

  await resizeImage(src.jpgPath, thumbPath, 400, 75);
  await resizeImage(src.jpgPath, mediumPath, 800, 82);

  const blurDataUrl = await generateBlurPlaceholder(src.jpgPath);

  return {
    thumb: `/images/originals/${src.landmark}/thumb.webp`,
    medium: `/images/originals/${src.landmark}/medium.webp`,
    blurDataUrl,
  };
}

// ---------------------------------------------------------------------------
// Sitemap Generation
// ---------------------------------------------------------------------------

function generateSitemap(artworks: ArtworkEntry[]): string {
  const urls: string[] = [];

  const addUrl = (loc: string, priority: string, changefreq = "weekly") => {
    urls.push(
      `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    );
  };

  // Static pages
  addUrl(BASE_URL, "1.0", "weekly");
  addUrl(`${BASE_URL}/gallery`, "0.9", "weekly");
  addUrl(`${BASE_URL}/explore`, "0.8", "weekly");
  addUrl(`${BASE_URL}/about`, "0.5", "monthly");

  // Unique landmarks
  const landmarks = [...new Set(artworks.map((a) => a.landmark))];
  for (const landmark of landmarks) {
    addUrl(`${BASE_URL}/landmarks/${landmark}`, "0.7", "monthly");
  }

  // Unique styles
  const styles = [...new Set(artworks.map((a) => a.style))];
  for (const style of styles) {
    addUrl(`${BASE_URL}/styles/${style}`, "0.7", "monthly");
  }

  // Individual artwork pages
  for (const artwork of artworks) {
    addUrl(`${BASE_URL}/artworks/${artwork.id}`, "0.6", "monthly");
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const startTime = Date.now();
  console.log("=== Build Catalog ===\n");

  // Ensure output directories exist
  fs.mkdirSync(path.dirname(CATALOG_PATH), { recursive: true });
  fs.mkdirSync(ARTWORKS_DIR, { recursive: true });
  fs.mkdirSync(ORIGINALS_DIR, { recursive: true });

  // 1. Scan poster sources
  console.log("Scanning poster sources...");
  const phase1Posters = scanPosters(PHASE_1_POSTERS, 1);
  const phase2Posters = scanPosters(PHASE_2_POSTERS, 2);
  const allPosters = [...phase1Posters, ...phase2Posters];
  console.log(`  Phase 1 posters: ${phase1Posters.length}`);
  console.log(`  Phase 2 posters: ${phase2Posters.length}`);
  console.log(`  Total posters:   ${allPosters.length}\n`);

  // 2. Scan original photo sources
  console.log("Scanning original photos...");
  const phase1Originals = scanOriginals(PHASE_1_ORIGINALS, 1, PHASE_1_LANDMARKS);
  const phase2Originals = scanOriginals(PHASE_2_ORIGINALS, 2, PHASE_2_LANDMARKS);
  const allOriginals = [...phase1Originals, ...phase2Originals];
  console.log(`  Phase 1 originals: ${phase1Originals.length}`);
  console.log(`  Phase 2 originals: ${phase2Originals.length}`);
  console.log(`  Total originals:   ${allOriginals.length}\n`);

  // 3. Process original photos first (we need them for artwork entries)
  console.log("Processing original photos...");
  const originalMap = new Map<string, OriginalImages>();
  let processedOriginals = 0;

  const originalTasks = allOriginals.map((src) => async () => {
    const images = await processOriginalImages(src);
    originalMap.set(src.landmark, images);
    processedOriginals++;
    if (processedOriginals % 10 === 0 || processedOriginals === allOriginals.length) {
      console.log(`  Originals: ${processedOriginals}/${allOriginals.length}`);
    }
    return images;
  });
  await parallelLimit(originalTasks, CONCURRENCY_LIMIT);
  console.log();

  // 4. Process styled artworks
  console.log("Processing styled artworks...");
  let processedArtworks = 0;

  const artworkEntries: ArtworkEntry[] = [];
  const artworkTasks = allPosters.map((src) => async () => {
    // Read metadata
    const metaRaw = fs.readFileSync(src.jsonPath, "utf-8");
    const meta: MetadataJson = JSON.parse(metaRaw);

    // Process images
    const images = await processArtworkImages(src);

    // Get original images for this landmark
    const original = originalMap.get(src.landmark);
    if (!original) {
      console.warn(`  [WARN] No original photo found for landmark: ${src.landmark}`);
    }

    const entry: ArtworkEntry = {
      id: `${src.landmark}_${src.style}`,
      landmark: src.landmark,
      style: src.style,
      title: meta.title,
      description: meta.description,
      tags: meta.tags,
      images,
      original: original ?? {
        thumb: "",
        medium: "",
        blurDataUrl: "",
      },
      phase: src.phase,
    };

    processedArtworks++;
    if (processedArtworks % 25 === 0 || processedArtworks === allPosters.length) {
      console.log(`  Artworks: ${processedArtworks}/${allPosters.length}`);
    }

    return entry;
  });

  const entries = await parallelLimit(artworkTasks, CONCURRENCY_LIMIT);

  // Sort entries consistently: by landmark then by style
  entries.sort((a, b) => {
    const landmarkCmp = a.landmark.localeCompare(b.landmark);
    if (landmarkCmp !== 0) return landmarkCmp;
    return a.style.localeCompare(b.style);
  });

  artworkEntries.push(...entries);
  console.log();

  // 5. Build catalog
  const uniqueLandmarks = new Set(artworkEntries.map((e) => e.landmark));
  const uniqueStyles = new Set(artworkEntries.map((e) => e.style));

  const catalog: ArtworkCatalog = {
    generatedAt: new Date().toISOString(),
    totalArtworks: artworkEntries.length,
    totalLandmarks: uniqueLandmarks.size,
    totalStyles: uniqueStyles.size,
    artworks: artworkEntries,
  };

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
  console.log(`Catalog written: ${CATALOG_PATH}`);
  console.log(`  ${catalog.totalArtworks} artworks, ${catalog.totalLandmarks} landmarks, ${catalog.totalStyles} styles\n`);

  // 6. Generate sitemap
  const sitemapXml = generateSitemap(artworkEntries);
  fs.writeFileSync(SITEMAP_PATH, sitemapXml);
  const totalUrls = 4 + uniqueLandmarks.size + uniqueStyles.size + artworkEntries.length;
  console.log(`Sitemap written: ${SITEMAP_PATH}`);
  console.log(`  ${totalUrls} URLs total\n`);

  // Done
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`=== Done in ${elapsed}s ===`);
}

main().catch((err) => {
  console.error("Build catalog failed:", err);
  process.exit(1);
});
