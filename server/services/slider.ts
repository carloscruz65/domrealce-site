import { readFile } from "fs/promises";
import path from "path";

export async function getSlidesFromDatabase() {
  const filePath = path.join(__dirname, "../data/slides.json");
  const file = await readFile(filePath, "utf-8");
  return JSON.parse(file);
}