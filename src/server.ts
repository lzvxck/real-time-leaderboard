import { createServer } from "node:http";
import { Leaderboard } from "./leaderboard";
import { incrementCount } from "./metrics";

export function createApp(board: Leaderboard) {
  return createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");

    if (req.method === "POST" && url.pathname === "/increment") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const { key, amount } = JSON.parse(body || "{}");
        const score = board.increment(key, amount ?? 1);
        incrementCount.increment();
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ key, score }));
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/top") {
      const n = Number(url.searchParams.get("n") ?? "10");
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(board.topN(n)));
      return;
    }

    if (req.method === "GET" && url.pathname === "/metrics") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ increments: incrementCount.get() }));
      return;
    }

    res.writeHead(404);
    res.end();
  });
}
