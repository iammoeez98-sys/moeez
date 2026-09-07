const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const spritesDir = "d:/Portfolio/portfolio/public/sprite_images";
const mediaDir = "d:/Portfolio/portfolio/public/images";

const mediaFiles = [
  "media_1788525345112.png", // 1. Woman straight bob, 3-eye glasses, off-shoulder top
  "media_1788525351322.png", // 2. Man 3-eye, glasses, dotted shirt, holding phone
  "media_1788525358296.png", // 3. Woman bun, cyclops eye, wavy shirt, finger up
  "media_1788525364357.png", // 4. Woman wavy pigtails, 3-eye glasses, off-shoulder top
  "media_1788525370256.png", // 5. Woman dotted ponytail, cyclops eye, dark t-shirt
];

// Helper to convert PNG to grayscale array
function getGrayData(png) {
  const data = new Float32Array(png.width * png.height);
  for (let i = 0; i < png.width * png.height; i++) {
    const idx = i << 2;
    const a = png.data[idx + 3] / 255;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    // Composite over black background if transparent
    data[i] = a > 0.1 ? gray : 0;
  }
  return { data, width: png.width, height: png.height };
}

// Compare target image with sprite using sliding window correlation
function findBestMatch(mediaPng, spritePng) {
  const m = getGrayData(mediaPng);
  const s = getGrayData(spritePng);

  let maxCorr = -Infinity;

  // Scale target to match sprite aspect ratio approx
  const targetW = 60;
  const targetH = 80;

  const mSample = new Float32Array(targetW * targetH);
  const sSample = new Float32Array(targetW * targetH);

  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      const mx = Math.floor((x / targetW) * m.width);
      const my = Math.floor((y / targetH) * m.height);
      mSample[y * targetW + x] = m.data[my * m.width + mx];

      const sx = Math.floor((x / targetW) * s.width);
      const sy = Math.floor((y / targetH) * s.height);
      sSample[y * targetW + x] = s.data[sy * s.width + sx];
    }
  }

  let dot = 0, normM = 0, normS = 0;
  for (let i = 0; i < mSample.length; i++) {
    dot += mSample[i] * sSample[i];
    normM += mSample[i] * mSample[i];
    normS += sSample[i] * sSample[i];
  }

  if (normM === 0 || normS === 0) return 0;
  return dot / (Math.sqrt(normM) * Math.sqrt(normS));
}

console.log("=== COMPARING ALL 105 SPRITES AGAINST USER SCREENSHOTS ===");

mediaFiles.forEach((fileName, mediaIdx) => {
  const mediaPath = path.join(mediaDir, fileName);
  const mediaPng = PNG.sync.read(fs.readFileSync(mediaPath));

  const results = [];
  for (let i = 0; i < 105; i++) {
    const spritePath = path.join(spritesDir, `sprite_${i}.png`);
    const spritePng = PNG.sync.read(fs.readFileSync(spritePath));
    const score = findBestMatch(mediaPng, spritePng);
    results.push({ index: i, score, row: Math.floor(i / 15), col: i % 15 });
  }

  results.sort((a, b) => b.score - a.score);

  console.log(`\nMedia ${mediaIdx + 1} (${fileName}):`);
  for (let k = 0; k < 3; k++) {
    console.log(`  Top ${k + 1}: Index ${results[k].index} (Row ${results[k].row}, Col ${results[k].col}) - Score: ${results[k].score.toFixed(4)}`);
  }
});
