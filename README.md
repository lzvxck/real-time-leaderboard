# real-time-leaderboard

An in-memory real-time leaderboard/counter service. Tracks scores for a
large, hot set of keys (e.g. per-user counters) and serves top-N queries
with low latency.

## Development

```
npm install
npm test
```

## Architecture

- **Sharding** (`src/sharding.ts`): keys are routed to one of N in-memory
  shards by hash, so no single `Map` becomes a bottleneck.
- **Rebalancing** (`src/rebalance.ts`): a shard that grows past a key-count
  threshold is split in two. An earlier version triggered this from the
  write path with no write-pause during the split, which dropped in-flight
  increments under load — that trigger was reverted pending a design that
  pauses (or queues) writes to a shard for the duration of its own split.
- **Replication** (`src/replication.ts`): each region asynchronously
  replicates increments to the other. An earlier version resolved conflicts
  by wall-clock last-write-wins, which silently dropped updates under clock
  skew between regions — that resolution strategy was reverted pending a
  vector-clock or CRDT-based approach.
- **Backpressure** (`src/backpressure.ts`): shards reject new work past an
  in-flight threshold rather than queueing unboundedly.
