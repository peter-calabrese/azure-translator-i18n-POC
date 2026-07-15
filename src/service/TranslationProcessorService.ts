import type { AzureTranslationService } from "./AzureTranslationService.js";

import fs from "fs";
import path from "path";
type TranslationEntry = {
  path: string[];
  text: string;
};

export class TranslationProcessorService {
  private azTranslator: AzureTranslationService;

  constructor(azTranslator: AzureTranslationService) {
    this.azTranslator = azTranslator;
  }

  async processTranslations(
    locales: Record<string, any>,
    targetLanguages: string[],
  ): Promise<void> {
    for (const [_, locale] of Object.entries(locales)) {
      const localPath = locale[0];
      const value = locale[1];
      const flattenedTranslations = this.flattener(value);
      console.log(flattenedTranslations);
      const response = await this.azTranslator.translateObject(
        flattenedTranslations,
        targetLanguages,
      );

      const translations = response.reduce<
        Record<string, string[]>
      >((languages, result) => {
        for (const translation of result.translations) {
          languages[translation.to] ??= [];
          languages[translation.to]!.push(translation.text);
        }
        return languages;
      }, {});

      Object.entries(translations).forEach(([lang, texts]) => {
        if(!texts) throw new Error(`No translations found for language: ${lang}`);

        const rebuiltTranslations = texts.reduce<Record<string, unknown>>(
          (result, translatedText, index) => {

            const originalPath = flattenedTranslations[index]?.path || [];
            
            let current = result;
            for (const key of originalPath.slice(0, -1)) {
            current[key] ??= {};
            current = current[key] as Record<string, unknown>;
            }
              current[originalPath.at(-1)!] = translatedText;

            return result;
          },
          {},
        );

        const outputPath = `src/locales/${lang}/${localPath}.json`;

        fs.mkdirSync(path.dirname(outputPath), {
          recursive: true,
        });

        fs.writeFileSync(
          outputPath,
          JSON.stringify(rebuiltTranslations, null, 2),
          "utf8",
        );
      });
    }
  }

  private flattener(value: unknown, path: string[] = []): TranslationEntry[] {
    if (typeof value === "string") {
      return [{ path, text: value }];
    }

    if (value !== null && typeof value === "object") {
      return Object.entries(value).flatMap(([key, nestedValue]) =>
        this.flattener(nestedValue, [...path, key]),
      );
    }

    return [];
  }

  private setNestedValue(
    object: Record<string, unknown>,
    propertyPath: string[],
    value: string,
  ) {
    let current = object;
    
    for (const key of propertyPath.slice(0, -1)) {
      current[key] ??= {};
      current = current[key] as Record<string, unknown>;
    }

    current[propertyPath.at(-1)!] = value;
  }
}
