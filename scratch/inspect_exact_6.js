const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const mediaFiles = [
  { id: 1, file: "media_1788525345112.png", candidates: [12, 60, 63, 88] },
  { id: 2, file: "media_1788525351322.png", candidates: [8, 16, 73, 103] },
  { id: 3, file: "media_1788525358296.png", candidates: [18, 49, 53, 103] },
  { id: 4, file: "media_1788525364357.png", candidates: [17, 47, 62, 77, 92, 101] },
  { id: 5, file: "media_1788525370256.png", candidates: [11, 26, 41, 56, 71, 86] },
];

const spritesDir = "d:/Portfolio/portfolio/public/sprite_images";
const mediaDir = "d:/Portfolio/portfolio/public/images";

function getPNG(filePath) {
  return PNG.sync.read(fs.readFileSync(filePath));
}

// Compare content area
function compareImages(pngA, pngB) {
  const size = 100;
  let diff = 0;
  let count = 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const ax = Math.floor((x / size) * pngA.width);
      const ay = Math.floor((y / size) * pngA.height);
      const aIdx = (pngA.width * ay + ax) << 2;
      const aVal = pngA.data[aIdx + 3] > 50 && pngA.data[aIdx] < 150 ? 1 : 0;

      const bx = Math.floor((x / size) * pngB.width);
      const by = Math.floor((y / size) * pngB.height);
      const bIdx = (pngB.width * by + bx) << 2;
      const bVal = pngB.data[bIdx + 3] > 50 && pngB.data[bIdx] < 150 ? 1 : 0;

      if (aVal !== bVal) diff++;
      count++;
    }
  }
  return 1 - diff / count;
}

mediaFiles.forEach((m) => {
  const mPng = getPNG(path.join(mediaDir, m.file));
  console.log(`\nMedia ${m.id} (${m.file}):`);
  const scores = m.candidates.map((idx) => {
    const sPng = getPNG(path.join(spritesDir, `sprite_${idx}.png`));
    const score = compareImages(mPng, sPng);
    return { idx, score };
  });
  scores.sort((a, b) => b.score - a.score);
  scores.forEach((s) => {
    const r = Math.floor(s.idx / 15);
    const c = s.idx % 15;
    console.log(`  Index ${s.idx} (Row ${r}, Col ${c}) -> Match Score: ${(s.score * 100).toFixed(2)}%`);
  });
});
