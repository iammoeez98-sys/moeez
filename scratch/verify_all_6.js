const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const spritesDir = "d:/Portfolio/portfolio/public/sprite_images";

// Candidates list to double check
const candidates = [
  { target: "1. Woman straight bob, 3-eye glasses, off-shoulder top", indices: [12, 60, 63, 88] },
  { target: "2. Man 3-eye, glasses, dotted shirt, holding phone", indices: [8, 16, 73, 103] },
  { target: "3. Woman bun, cyclops eye, wavy shirt, finger up", indices: [18, 49, 53, 103] },
  { target: "4. Woman wavy low pigtails, 3-eye glasses, off-shoulder top", indices: [17, 47, 62, 77, 92, 101] },
  { target: "5. Woman dotted ponytail, cyclops eye, dark top", indices: [11, 26, 41, 56, 71, 86] },
  { target: "6. Man glasses, plain top with lightning bolt graphic", indices: [10, 25, 40, 55, 70, 85, 100] },
];

console.log("=== CANDIDATE VERIFICATION ===");
candidates.forEach((c) => {
  console.log(`\n${c.target}:`);
  c.indices.forEach((idx) => {
    const r = Math.floor(idx / 15);
    const col = idx % 15;
    console.log(`  Index ${idx} -> Row ${r}, Col ${col}`);
  });
});
