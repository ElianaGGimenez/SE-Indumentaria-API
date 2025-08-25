import { promises as fs } from "fs";

export async function ensureFile(path, initial = "[]") {
  try {
    await fs.access(path);
  } catch {
    await fs.writeFile(path, initial);
  }
}

export async function readJSON(path) {
  await ensureFile(path);
  const data = await fs.readFile(path, "utf-8");
  return JSON.parse(data || "[]");
}

export async function writeJSON(path, data) {
  await fs.writeFile(path, JSON.stringify(data, null, 2));
}
