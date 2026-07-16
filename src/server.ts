import { createServer } from "node:http";
import { Leaderboard } from "./leaderboard";

export function createApp(board: Leaderboard) {
  return createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");

    if (req.method === "POST" && url.pathname === "/increment") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const { key, amount } = JSON.parse(body || "{}");
        const score = board.increment(key, amount ?? 1);
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

    res.writeHead(404);
    res.end();
  });
}
