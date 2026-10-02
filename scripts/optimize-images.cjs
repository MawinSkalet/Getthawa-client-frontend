const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require("sharp");

// Originals remain available. The manifest connects existing API image paths
// to prebuilt, content-addressed WebP sizes, avoiding cold server conversions.
async function main() {
  const publicDir = path.join(__dirname, "../public");
  const output = path.join(publicDir, "optimized");
  fs.mkdirSync(output, { recursive: true });
  const files = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory() && !["optimized", "locales", "flags"].includes(entry.name)) walk(file);
      else if (entry.isFile() && /\.(png|jpe?g|webp)$/i.test(file) && !/playwright|upscale|bg-patch/i.test(entry.name)) files.push(file);
    }
  }
  walk(publicDir);
  const manifest = {};
  let before = 0, after = 0;
  for (const file of files) {
    const bytes = fs.readFileSync(file);
    let metadata;
    try { metadata = await sharp(bytes).metadata(); }
    catch { console.warn("Skipping unsupported image:", path.relative(publicDir, file)); continue; }
    const maxWidth = /certifications/.test(file) ? 160 : /ornament|crest|motif|decorative/i.test(file) ? 320 : /menu-poster/.test(file) ? metadata.width : Math.min(1440, metadata.width);
    const widths = [...new Set([320, 640, 960, maxWidth].filter(width => width <= maxWidth))].sort((a, b) => a - b);
    const key = "/" + path.relative(publicDir, file).split(path.sep).join("/");
    const hash = crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 12);
    const variants = [];
    for (const width of widths) {
      const name = hash + "-" + width + ".webp";
      const target = path.join(output, name);
      await sharp(bytes).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: /menu-poster/.test(file) ? 90 : 78, effort: 5 }).toFile(target);
      variants.push({ width, src: "/optimized/" + name });
    }
    manifest[key] = variants;
    before += bytes.length;
    after += fs.statSync(path.join(publicDir, variants.at(-1).src)).size;
  }
  fs.writeFileSync(path.join(__dirname, "../src/lib/image-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(JSON.stringify({ images: files.length, originalBytes: before, largestOptimizedBytes: after, savedPercent: Math.round((1 - after / before) * 100) }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
