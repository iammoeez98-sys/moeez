const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const spritesDir = "d:/Portfolio/portfolio/public/sprite_images";

console.log("Searching all 105 sprites for specific head/body features...");

// Loop over all 105 sprites to inspect chest area (lightning bolt graphic, patterned tops)
for (let i = 0; i < 105; i++) {
  const spritePath = path.join(spritesDir, `sprite_${i}.png`);
  const png = PNG.sync.read(fs.readFileSync(spritePath));
  const r = Math.floor(i / 15);
  const c = i % 15;

  // Inspect chest area y: 160-240, x: 80-160
  let chestDarkCount = 0;
  let chestWhiteInDarkCount = 0;

  for (let y = 160; y < 240; y++) {
    for (let x = 80; x < 160; x++) {
      const idx = (png.width * y + x) << 2;
      const red = png.data[idx];
      const green = png.data[idx + 1];
      const blue = png.data[idx + 2];
      const alpha = png.data[idx + 3];

      if (alpha > 50) {
        if (red < 100 && green < 100 && blue < 100) {
          chestDarkCount++;
        }
        // White graphic on dark top
        if (red > 200 && green > 200 && blue > 200) {
          chestWhiteInDarkCount++;
        }
      }
    }
  }

  // Printed info for sprites with chest graphics or distinctive tops
  if (chestDarkCount > 2500 && chestWhiteInDarkCount > 300) {
    console.log(`Sprite ${i} (Row ${r}, Col ${c}): Chest Dark=${chestDarkCount}, WhiteInDark=${chestWhiteInDarkCount}`);
  }
}
