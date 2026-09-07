const fs = require("fs");
const path = require("path");

const mediaList = [
  { file: "media_1788525345112.png", desc: "1. Woman straight bob, 3-eye glasses, off-shoulder top" },
  { file: "media_1788525351322.png", desc: "2. Man 3-eye, glasses, dotted shirt, holding phone" },
  { file: "media_1788525358296.png", desc: "3. Woman bun, cyclops eye, wavy shirt, finger up" },
  { file: "media_1788525364357.png", desc: "4. Woman wavy low pigtails, 3-eye glasses, off-shoulder top" },
  { file: "media_1788525370256.png", desc: "5. Woman dotted ponytail, cyclops eye, dark t-shirt" },
];

let html = `<!DOCTYPE html>
<html>
<head>
<title>Sprite Match Checker</title>
<style>
  body { background: #0b0f19; color: #f1f5f9; font-family: system-ui, sans-serif; padding: 20px; }
  .section { border: 1px solid #1e293b; background: #111827; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
  .user-img { height: 180px; border: 2px solid #ef4444; border-radius: 4px; background: #000; }
  .candidate-grid { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
  .card { border: 1px solid #334155; padding: 6px; text-align: center; background: #1f2937; border-radius: 6px; }
  .sprite-box { width: 120px; height: 162px; overflow: hidden; position: relative; background: #000; }
  .sprite-img { position: absolute; width: 1800px; height: 1134px; max-width: none; }
</style>
</head>
<body>
  <h1>User Uploaded Screenshots vs 105 Sprite Sheet Candidates</h1>
`;

mediaList.forEach((m, idx) => {
  html += `
  <div class="section">
    <h2>${m.desc}</h2>
    <div style="display: flex; gap: 20px; align-items: center;">
      <div>
        <div style="font-weight: bold; color: #ef4444; margin-bottom: 4px;">User Screenshot (${m.file})</div>
        <img class="user-img" src="/images/${m.file}" />
      </div>
      <div>
        <div style="font-weight: bold; color: #38bdf8; margin-bottom: 4px;">All 105 Sprites Grid Reference</div>
        <p>Open <a href="/all_sprites_sheet.html" target="_blank" style="color: #38bdf8;">all_sprites_sheet.html</a> to locate index</p>
      </div>
    </div>
  </div>`;
});

html += `</body></html>`;

fs.writeFileSync("d:/Portfolio/portfolio/public/match_checker.html", html);
console.log("Exported public/match_checker.html");
