const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const spritesDir = "d:/Portfolio/portfolio/public/sprite_images";

for (let i = 0; i < 105; i++) {
  const spritePath = path.join(spritesDir, `sprite_${i}.png`);
  const png = PNG.sync.read(fs.readFileSync(spritePath));
  const r = Math.floor(i / 15);
  const c = i % 15;

  // Measure dark pixel distribution in upper half (head/hair) vs lower half (clothing)
  let headPixels = 0;
  let bodyPixels = 0;
  let leftHandPixels = 0;
  let rightHandPixels = 0;
  let centerDarkPixels = 0;

  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const alpha = png.data[idx + 3];
      const red = png.data[idx];
      const green = png.data[idx + 1];
      const blue = png.data[idx + 2];

      const isDark = alpha > 50 && red < 150;
      if (isDark) {
        if (y < png.height * 0.45) headPixels++;
        else bodyPixels++;

        if (x < png.width * 0.3 && y > png.height * 0.3) leftHandPixels++;
        if (x > png.width * 0.7 && y > png.height * 0.3) rightHandPixels++;
        if (x > png.width * 0.35 && x < png.width * 0.65 && y > png.height * 0.45) centerDarkPixels++;
      }
    }
  }

  // Log sprites with distinctive features
  if (bodyPixels > 8000 || centerDarkPixels > 4000 || leftHandPixels > 2500 || rightHandPixels > 2500) {
    console.log(`Sprite ${i} (Row ${r}, Col ${c}): head=${headPixels}, body=${bodyPixels}, centerDark=${centerDarkPixels}, leftH=${leftHandPixels}, rightH=${rightHandPixels}`);
  }
}
