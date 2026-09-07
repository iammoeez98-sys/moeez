const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const spritesDir = "d:/Portfolio/portfolio/public/sprite_images";

console.log("=== GRID MAPPING REPORT ===");

// Print top head region hash and bottom clothing region hash for all 105 sprites
for (let r = 0; r < 7; r++) {
  let rowStr = `Row ${r}: `;
  for (let c = 0; c < 15; c++) {
    const idx = r * 15 + c;
    rowStr += `[${idx}] `;
  }
  console.log(rowStr);
}
