const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const spritesDir = "d:/Portfolio/portfolio/public/sprite_images";

console.log("=== DETAILED SPRITE FEATURE SCANNER ===");

for (let i = 0; i < 105; i++) {
  const spritePath = path.join(spritesDir, `sprite_${i}.png`);
  const png = PNG.sync.read(fs.readFileSync(spritePath));
  const r = Math.floor(i / 15);
  const c = i % 15;

  // Feature detection
  // 1. Check if holding phone/hand in upper-right / right side (x: 160-220, y: 100-200)
  let rightHandContent = 0;
  for (let y = 100; y < 200; y++) {
    for (let x = 150; x < 220; x++) {
      const idx = (png.width * y + x) << 2;
      if (png.data[idx + 3] > 50 && png.data[idx] < 150) rightHandContent++;
    }
  }

  // 2. Check if holding hand/finger in upper-left / left side (x: 20-90, y: 100-200)
  let leftHandContent = 0;
  for (let y = 100; y < 200; y++) {
    for (let x = 20; x < 90; x++) {
      const idx = (png.width * y + x) << 2;
      if (png.data[idx + 3] > 50 && png.data[idx] < 150) leftHandContent++;
    }
  }

  // 3. Check for dark off-shoulder top (y: 180-260, x: 40-200 dark pixels > 70%)
  let offShoulderDark = 0;
  for (let y = 180; y < 260; y++) {
    for (let x = 40; x < 200; x++) {
      const idx = (png.width * y + x) << 2;
      if (png.data[idx + 3] > 50 && png.data[idx] < 100) offShoulderDark++;
    }
  }

  // 4. Check for lightning bolt shirt (white pixels surrounded by dark pixels on chest)
  let chestWhiteCount = 0;
  for (let y = 180; y < 250; y++) {
    for (let x = 90; x < 150; x++) {
      const idx = (png.width * y + x) << 2;
      if (png.data[idx + 3] > 50 && png.data[idx] > 200) chestWhiteCount++;
    }
  }

  if (rightHandContent > 800 || leftHandContent > 800 || offShoulderDark > 10000 || chestWhiteCount > 500) {
    console.log(`Sprite ${i} (r:${r}, c:${c}) -> rightHand:${rightHandContent}, leftHand:${leftHandContent}, offShoulder:${offShoulderDark}, chestWhite:${chestWhiteCount}`);
  }
}
