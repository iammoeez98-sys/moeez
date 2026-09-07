const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const allPeepsPath = "d:/Portfolio/portfolio/public/images/peeps/all-peeps.png";
const outDir = "C:/Users/SoftMind Solutions/.gemini/antigravity/brain/f6629792-b2ec-4f39-b709-d667c32541eb/scratch/sprites";

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.createReadStream(allPeepsPath)
  .pipe(new PNG())
  .on("parsed", function () {
    const W = this.width; // 3600
    const H = this.height; // 2268
    const cols = 15;
    const rows = 7;
    const cellW = W / cols; // 240
    const cellH = H / rows; // 324

    console.log(`Image parsed: ${W}x${H}. Cell size: ${cellW}x${cellH}`);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const cell = new PNG({ width: cellW, height: cellH });

        for (let y = 0; y < cellH; y++) {
          for (let x = 0; x < cellW; x++) {
            const srcX = c * cellW + x;
            const srcY = r * cellH + y;
            const srcIdx = (W * srcY + srcX) << 2;
            const dstIdx = (cellW * y + x) << 2;

            cell.data[dstIdx] = this.data[srcIdx];
            cell.data[dstIdx + 1] = this.data[srcIdx + 1];
            cell.data[dstIdx + 2] = this.data[srcIdx + 2];
            cell.data[dstIdx + 3] = this.data[srcIdx + 3];
          }
        }

        const outPath = path.join(outDir, `sprite_${i}.png`);
        cell.pack().pipe(fs.createWriteStream(outPath));
      }
    }
    console.log(`Exported 105 sprites to ${outDir}`);
  });
