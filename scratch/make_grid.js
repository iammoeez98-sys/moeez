const fs = require("fs");

let html = `<!DOCTYPE html>
<html>
<head>
<title>105 Peeps Sprites Grid</title>
<style>
  body { background: #000; color: #fff; font-family: monospace; padding: 20px; }
  h1 { text-align: center; color: #38bdf8; }
  .grid { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
  .card { border: 2px solid #333; padding: 8px; text-align: center; background: #111; border-radius: 8px; }
  .card.highlight { border-color: #ef4444; background: #2a0808; }
  .img { width: 140px; height: 189px; object-fit: contain; background: #1a1a1a; display: block; margin: 0 auto; border: 1px solid #444; }
  .title { font-size: 14px; font-weight: bold; margin-top: 6px; color: #facc15; }
  .sub { font-size: 11px; color: #9ca3af; }
</style>
</head>
<body>
  <h1>All 105 Peeps Sprites (Indexed 0 to 104)</h1>
  <div class="grid">
`;

for (let i = 0; i < 105; i++) {
  const r = Math.floor(i / 15);
  const c = i % 15;
  html += `
  <div class="card">
    <img class="img" src="/sprite_images/sprite_${i}.png" />
    <div class="title">INDEX ${i}</div>
    <div class="sub">Row ${r}, Col ${c}</div>
  </div>`;
}

html += `
  </div>
</body>
</html>`;

fs.writeFileSync("d:/Portfolio/portfolio/public/sprites_grid_preview.html", html);
console.log("Created public/sprites_grid_preview.html");
