import { execFileSync } from "node:child_process";

/**
 * Return the oldest add-commit time visible in Git history, in milliseconds.
 * @param {{ repoRoot: string, filePath: string }} options
 */
export function gitAddedAt({ repoRoot, filePath }) {
  const log = execFileSync(
    "git",
    ["log", "--diff-filter=A", "--follow", "--format=%ct", "--", filePath],
    { cwd: repoRoot, encoding: "utf8" },
  )
    .trim()
    .split("\n")
    .filter(Boolean);
  const first = log.at(-1);
  return first ? Number(first) * 1000 : undefined;
}
