const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const mediaFiles = [
  "C:/Users/SoftMind Solutions/.gemini/antigravity/brain/f6629792-b2ec-4f39-b709-d667c32541eb/.user_uploaded/media_1788525345112.png",
  "C:/Users/SoftMind Solutions/.gemini/antigravity/brain/f6629792-b2ec-4f39-b709-d667c32541eb/.user_uploaded/media_1788525351322.png",
  "C:/Users/SoftMind Solutions/.gemini/antigravity/brain/f6629792-b2ec-4f39-b709-d667c32541eb/.user_uploaded/media_1788525358296.png",
  "C:/Users/SoftMind Solutions/.gemini/antigravity/brain/f6629792-b2ec-4f39-b709-d667c32541eb/.user_uploaded/media_1788525364357.png",
  "C:/Users/SoftMind Solutions/.gemini/antigravity/brain/f6629792-b2ec-4f39-b709-d667c32541eb/.user_uploaded/media_1788525370256.png",
];

const spritesDir = "C:/Users/SoftMind Solutions/.gemini/antigravity/brain/f6629792-b2ec-4f39-b709-d667c32541eb/scratch/sprites";

function loadPngSync(filePath) {
  const buf = fs.readFileSync(filePath);
  return PNG.sync.read(buf);
}

// Convert image to a normalized binary mask (1 for dark pixel, 0 for white/transparent)
function toBinaryGrid(png, targetW = 60, targetH = 81) {
  const grid = new Float32Array(targetW * targetH);
  for (let ty = 0; ty < targetH; ty++) {
    for (let tx = 0; tx < targetW; tx++) {
      const srcX = Math.floor((tx / targetW) * png.width);
      const srcY = Math.floor((ty / targetH) * png.height);
      const idx = (png.width * srcY + srcX) << 2;
      const r = png.data[idx];
      const g = png.data[idx + 1];
      const b = png.data[idx + 2];
      const a = png.data[idx + 3];

      // Dark pixel (black outline/filling) or non-white
      const isDark = a > 50 && (r < 150 || g < 150 || b < 150);
      grid[ty * targetW + tx] = isDark ? 1.0 : 0.0;
    }
  }
  return grid;
}

// Compare two grids using mean squared difference
function compareGrids(g1, g2) {
  let diff = 0;
  for (let i = 0; i < g1.length; i++) {
    diff += Math.abs(g1[i] - g2[i]);
  }
  return diff / g1.length;
}

console.log("Loading 105 sprites...");
const spriteGrids = [];
for (let i = 0; i < 105; i++) {
  const spritePng = loadPngSync(path.join(spritesDir, `sprite_${i}.png`));
  spriteGrids.push(toBinaryGrid(spritePng));
}

console.log("Matching uploaded images to sprite indices...");
mediaFiles.forEach((mediaPath, idx) => {
  const mediaPng = loadPngSync(mediaPath);
  const mediaGrid = toBinaryGrid(mediaPng);

  let bestMatch = -1;
  let bestScore = Infinity;

  const scores = [];
  for (let i = 0; i < 105; i++) {
    const score = compareGrids(mediaGrid, spriteGrids[i]);
    scores.push({ index: i, score });
    if (score < bestScore) {
      bestScore = score;
      bestMatch = i;
    }
  }

  scores.sort((a, b) => a.score - b.score);
  console.log(`\nMedia ${idx + 1} (${path.basename(mediaPath)}):`);
  console.log(`Top match: Sprite Index ${scores[0].index} (Score: ${scores[0].score.toFixed(4)})`);
  console.log(`2nd match: Sprite Index ${scores[1].index} (Score: ${scores[1].score.toFixed(4)})`);
  console.log(`3rd match: Sprite Index ${scores[2].index} (Score: ${scores[2].score.toFixed(4)})`);
});
