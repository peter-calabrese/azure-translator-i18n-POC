type TranslationEntry = {
  path: string[];
  text: string;
};

export function flattenTranslations(
  value: unknown,
  path: string[] = []
): TranslationEntry[] {
  if (typeof value === "string") {
    return [{ path, text: value }];
  }

  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, nestedValue]) =>
      flattenTranslations(nestedValue, [...path, key])
    );
  }

  return [];
}