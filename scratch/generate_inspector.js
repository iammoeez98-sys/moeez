const fs = require("fs");

let html = `<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #111; color: #fff; font-family: system-ui, sans-serif; padding: 20px; }
  h1 { margin-bottom: 20px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1)); gap: 12px; }
  .card { border: 1px solid #333; border-radius: 6px; padding: 8px; text-align: center; background: #1e1e1e; }
  .sprite-box { width: 120px; height: 162px; margin: 0 auto; overflow: hidden; position: relative; background: #000; border: 1px solid #444; }
  .sprite-img { position: absolute; width: 1800px; height: 1134px; max-width: none; }
  .meta { margin-top: 6px; font-size: 12px; font-weight: bold; color: #38bdf8; }
</style>
</head>
<body>
  <h1>All Peeps Sprite Inspector (15 cols x 7 rows = 105 Sprites)</h1>
  <div class="grid">
`;

const cols = 15;
const rows = 7;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const i = r * cols + c;
    const left = -(c * 120);
    const top = -(r * 162);
    html += `
    <div class="card">
      <div class="sprite-box">
        <img class="sprite-img" src="/images/peeps/all-peeps.png" style="left: ${left}px; top: ${top}px;" />
      </div>
      <div class="meta">Index ${i}<br/>Row ${r}, Col ${c}</div>
    </div>`;
  }
}

html += `
  </div>
</body>
</html>`;

fs.writeFileSync("d:/Portfolio/portfolio/public/sprite-inspector.html", html);
console.log("Successfully generated public/sprite-inspector.html");
