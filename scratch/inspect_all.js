const fs = require("fs");

let html = `<!DOCTYPE html>
<html>
<head>
<title>All 105 Peeps Sprites Grid</title>
<style>
  body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; padding: 24px; }
  h1 { text-align: center; margin-bottom: 24px; color: #38bdf8; }
  .grid { display: grid; grid-template-columns: repeat(15, 1fr); gap: 8px; }
  .card { border: 1px solid #334155; border-radius: 6px; padding: 4px; text-align: center; background: #1e293b; }
  .sprite-box { width: 100px; height: 135px; margin: 0 auto; overflow: hidden; position: relative; background: #000; border: 1px solid #475569; }
  .sprite-img { position: absolute; width: 1500px; height: 945px; max-width: none; }
  .meta { margin-top: 4px; font-size: 11px; font-weight: bold; color: #f1f5f9; }
  .coord { color: #94a3b8; font-size: 10px; }
</style>
</head>
<body>
  <h1>All Peeps Sprites Sheet (15 columns x 7 rows = 105 Sprites)</h1>
  <div class="grid">
`;

const cols = 15;
const rows = 7;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const i = r * cols + c;
    const left = -(c * 100);
    const top = -(r * 135);
    html += `
    <div class="card">
      <div class="sprite-box">
        <img class="sprite-img" src="/images/peeps/all-peeps.png" style="left: ${left}px; top: ${top}px;" />
      </div>
      <div class="meta">Index ${i}</div>
      <div class="coord">R${r}, C${c}</div>
    </div>`;
  }
}

html += `
  </div>
</body>
</html>`;

fs.writeFileSync("d:/Portfolio/portfolio/public/all_sprites_sheet.html", html);
console.log("Exported public/all_sprites_sheet.html");
