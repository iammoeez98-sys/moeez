const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const spritesDir = "d:/Portfolio/portfolio/public/sprite_images";

const mediaFiles = [
  { id: 1, desc: "Woman straight bob, glasses, off-shoulder top", file: "media_1788525345112.png" },
  { id: 2, desc: "Man glasses, dotted shirt, holding phone", file: "media_1788525351322.png" },
  { id: 3, desc: "Woman bun, wavy shirt, finger gesture", file: "media_1788525358296.png" },
  { id: 4, desc: "Woman wavy low pigtails, glasses, off-shoulder top", file: "media_1788525364357.png" },
  { id: 5, desc: "Woman dotted ponytail, glasses/cyclops, dark top", file: "media_1788525370256.png" },
];

function loadPNG(filePath) {
  return PNG.sync.read(fs.readFileSync(filePath));
}

// Bounding box of content in PNG
function getBoundingBox(png) {
  let minX = png.width, minY = png.height, maxX = 0, maxY = 0;
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const alpha = png.data[idx + 3];
      const r = png.data[idx];
      const g = png.data[idx + 1];
      const b = png.data[idx + 2];
      if (alpha > 50 && (r < 200 || g < 200 || b < 200)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

// Crop & normalize to 50x50 binary grid
function getNormalizedMask(png, box, size = 50) {
  const mask = new Float32Array(size * size);
  for (let ty = 0; ty < size; ty++) {
    for (let tx = 0; tx < size; tx++) {
      const px = Math.floor(box.minX + (tx / size) * box.w);
      const py = Math.floor(box.minY + (ty / size) * box.h);
      if (px >= 0 && px < png.width && py >= 0 && py < png.height) {
        const idx = (png.width * py + px) << 2;
        const alpha = png.data[idx + 3];
        const r = png.data[idx];
        const isDark = alpha > 50 && r < 180 ? 1 : 0;
        mask[ty * size + tx] = isDark;
      }
    }
  }
  return mask;
}

// Pre-process all 105 sprites
const spriteMasks = [];
for (let i = 0; i < 105; i++) {
  const spritePath = path.join(spritesDir, `sprite_${i}.png`);
  const png = loadPNG(spritePath);
  const box = getBoundingBox(png);
  spriteMasks.push({ index: i, mask: getNormalizedMask(png, box), box });
}

console.log("Searching for exact matches for the 5 uploaded media screenshots...");

mediaFiles.forEach((m) => {
  const mPath = path.join("d:/Portfolio/portfolio/public/images", m.file);
  const mPng = loadPNG(mPath);
  const mBox = getBoundingBox(mPng);
  const mMask = getNormalizedMask(mPng, mBox);

  const scores = [];
  for (let i = 0; i < 105; i++) {
    let diff = 0;
    const sMask = spriteMasks[i].mask;
    for (let j = 0; j < mMask.length; j++) {
      diff += Math.abs(mMask[j] - sMask[j]);
    }
    const matchPercent = (100 * (1 - diff / mMask.length)).toFixed(2);
    scores.push({
      index: i,
      row: Math.floor(i / 15),
      col: i % 15,
      matchPercent: parseFloat(matchPercent),
      diff,
    });
  }

  scores.sort((a, b) => b.matchPercent - a.matchPercent);

  console.log(`\n----------------------------------------`);
  console.log(`Target: ${m.name}`);
  console.log(`Top 5 Best Matches:`);
  for (let k = 0; k < 5; k++) {
    console.log(`  #${k + 1}: Index ${scores[k].index} (Row ${scores[k].row}, Col ${scores[k].col}) -> Match: ${scores[k].matchPercent}%`);
  }
});
