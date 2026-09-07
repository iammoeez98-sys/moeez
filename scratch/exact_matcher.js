const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const allPeeps = PNG.sync.read(fs.readFileSync("d:/Portfolio/portfolio/public/images/peeps/all-peeps.png"));
const cols = 15;
const rows = 7;
const cellW = 240;
const cellH = 324;

// Load media files
const mediaFiles = [
  { name: "Woman straight bob, 3-eye glasses, off-shoulder top", file: "media_1788525345112.png" },
  { name: "Man 3-eye, glasses, dotted shirt, holding phone", file: "media_1788525351322.png" },
  { name: "Woman bun, cyclops eye, wavy shirt, finger up", file: "media_1788525358296.png" },
  { name: "Woman wavy low pigtails, 3-eye glasses, off-shoulder top", file: "media_1788525364357.png" },
  { name: "Woman dotted ponytail, cyclops eye, dark t-shirt", file: "media_1788525370256.png" },
];

// Helper to get normalized 60x80 thumbnail of cell
function getCellThumb(r, c) {
  const thumb = new Float32Array(60 * 80);
  for (let ty = 0; ty < 80; ty++) {
    for (let tx = 0; tx < 60; tx++) {
      const px = c * cellW + Math.floor((tx / 60) * cellW);
      const py = r * cellH + Math.floor((ty / 80) * cellH);
      const idx = (allPeeps.width * py + px) << 2;
      const alpha = allPeeps.data[idx + 3];
      const r_val = allPeeps.data[idx];
      const isDark = alpha > 50 && r_val < 150 ? 1 : 0;
      thumb[ty * 60 + tx] = isDark;
    }
  }
  return thumb;
}

// Helper to get normalized 60x80 thumbnail of media PNG
function getMediaThumb(filePath) {
  const png = PNG.sync.read(fs.readFileSync(filePath));
  const thumb = new Float32Array(60 * 80);
  for (let ty = 0; ty < 80; ty++) {
    for (let tx = 0; tx < 60; tx++) {
      const px = Math.floor((tx / 60) * png.width);
      const py = Math.floor((ty / 80) * png.height);
      const idx = (png.width * py + px) << 2;
      const alpha = png.data[idx + 3];
      const r_val = png.data[idx];
      const isDark = alpha > 50 && r_val < 150 ? 1 : 0;
      thumb[ty * 60 + tx] = isDark;
    }
  }
  return thumb;
}

// Compute 105 cell thumbs
const cellThumbs = [];
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    cellThumbs.push(getCellThumb(r, c));
  }
}

console.log("=== EXACT SPRITE MATCH FINDER ===");
mediaFiles.forEach((m) => {
  const mPath = path.join("C:/Users/SoftMind Solutions/.gemini/antigravity/brain/f6629792-b2ec-4f39-b709-d667c32541eb/.user_uploaded", m.file);
  const mThumb = getMediaThumb(mPath);

  let bestIdx = 0;
  let minDiff = Infinity;
  const rank = [];

  for (let i = 0; i < 105; i++) {
    let diff = 0;
    const cThumb = cellThumbs[i];
    for (let j = 0; j < mThumb.length; j++) {
      diff += Math.abs(mThumb[j] - cThumb[j]);
    }
    rank.push({ idx: i, diff, row: Math.floor(i / cols), col: i % cols });
  }

  rank.sort((a, b) => a.diff - b.diff);

  console.log(`\nTarget: ${m.name}`);
  console.log(`Top 5 candidates:`);
  for (let k = 0; k < 5; k++) {
    console.log(`  Rank ${k + 1}: Index ${rank[k].idx} (Row ${rank[k].row}, Col ${rank[k].col}) - Diff: ${rank[k].diff}`);
  }
});
