import { describe, expect, it } from "vitest";
import { Leaderboard } from "../src/leaderboard";

describe("concurrent load", () => {
  it("keeps every increment under concurrent callers", async () => {
    const board = new Leaderboard();
    const callers = Array.from({ length: 200 }, () =>
      Promise.resolve().then(() => board.increment("hot-key", 1)),
    );
    await Promise.all(callers);
    expect(board.score("hot-key")).toBe(200);
  });
});
