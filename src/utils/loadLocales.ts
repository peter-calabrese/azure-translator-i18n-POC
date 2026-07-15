import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export async function loadLocales(language: string) {
  const localesRoot = path.resolve("src/locales", language);

  const entries = await readdir(localesRoot, {
    recursive: true,
  });

  const jsonFiles = entries.filter((entry) => entry.endsWith(".json"));

  const resources = await Promise.all(
    jsonFiles.map(async (relativePath) => {
      const absolutePath = path.join(localesRoot, relativePath);
      const contents = await readFile(absolutePath, "utf8");

      const namespace = relativePath
        .replace(/\.json$/, "")
        .split(path.sep)
        .join("/");

      return [namespace, JSON.parse(contents)] as const;
    }),
  );

  return resources
}