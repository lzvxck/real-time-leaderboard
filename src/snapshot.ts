import { readFileSync, writeFileSync, existsSync } from "node:fs";
import type { Leaderboard } from "./leaderboard";

export function saveSnapshot(board: Leaderboard, file: string) {
  writeFileSync(file, JSON.stringify(board.topN(Number.MAX_SAFE_INTEGER)));
}

export function loadSnapshot(board: Leaderboard, file: string) {
  if (!existsSync(file)) return;
  const entries = JSON.parse(readFileSync(file, "utf8")) as Array<{ key: string; score: number }>;
  for (const entry of entries) board.increment(entry.key, entry.score);
}
