export async function drainAndExit(
  guard: { inFlightCount(): number },
  onDrained: () => void,
  pollMs = 25,
) {
  while (guard.inFlightCount() > 0) {
    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }
  onDrained();
}
