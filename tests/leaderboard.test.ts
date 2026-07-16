import { describe, expect, it } from "vitest";
import { Leaderboard } from "../src/leaderboard";

describe("Leaderboard", () => {
  it("increments and reads a score", () => {
    const board = new Leaderboard();
    board.increment("alice", 5);
    board.increment("alice", 3);
    expect(board.score("alice")).toBe(8);
  });

  it("ranks topN by score descending", () => {
    const board = new Leaderboard();
    board.increment("alice", 5);
    board.increment("bob", 9);
    board.increment("carol", 2);
    expect(board.topN(2)).toEqual([
      { key: "bob", score: 9 },
      { key: "alice", score: 5 },
    ]);
  });
});
