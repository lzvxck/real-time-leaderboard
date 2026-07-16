type Level = "info" | "warn" | "error";

function emit(level: Level, message: string, fields: Record<string, unknown> = {}) {
  process.stdout.write(
    JSON.stringify({ level, message, ...fields, ts: new Date().toISOString() }) + "\n",
  );
}

export const logger = {
  info: (message: string, fields?: Record<string, unknown>) => emit("info", message, fields),
  warn: (message: string, fields?: Record<string, unknown>) => emit("warn", message, fields),
  error: (message: string, fields?: Record<string, unknown>) => emit("error", message, fields),
};
