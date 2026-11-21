// Writes public/theme-dates.json: first-commit time (ms epoch) per theme
// file. Runs in the assets workflow, which has full git history; deploy hosts
// do shallow clones where `git log` can't answer this, so the site build
// reads this manifest (fetched with the demo assets) instead.
import { mkdirSync, writeFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gitAddedAt } from "../src/lib/git-added-at.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const themesDir = path.join(root, "themes");
const dates = {};

for (const fileName of (await readdir(themesDir)).filter((name) => name.endsWith(".json"))) {
  const addedAt = gitAddedAt({ repoRoot: root, filePath: `themes/${fileName}` });
  if (addedAt !== undefined) dates[fileName] = addedAt;
}

mkdirSync(path.join(root, "public"), { recursive: true });
writeFileSync(
  path.join(root, "public", "theme-dates.json"),
  `${JSON.stringify(dates, null, 2)}\n`,
);
console.log(`✓ theme-dates.json: ${Object.keys(dates).length} theme(s)`);
