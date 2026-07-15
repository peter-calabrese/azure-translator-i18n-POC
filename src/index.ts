import { flattenTranslations } from "./flattenTranslations.js";
import { translateObject } from "./translationService.js";

const translations = {
  common: {
    save: "Save",
    cancel: "Cancel"
  },
  welcome: {
    title: "Welcome, {{name}}",
    message: "Thanks for visiting"
  }
};

const flattened = flattenTranslations(translations);

async function main() {
  const targetLanguages = ["es", "fr"];
  const translationEntries = flattened.map(entry => ({ text: entry.text }));

  await translateObject(translationEntries, targetLanguages);
}

main().catch(console.error);

