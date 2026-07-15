import { AzureTranslationService } from "./service/AzureTranslationService.js";
import { loadLocales } from "./utils/loadLocales.js";
import { TranslationProcessorService } from "./service/TranslationProcessorService.js";

async function main() {
  const azTranslator = new AzureTranslationService();
  const translatorProcessor = new TranslationProcessorService(azTranslator);
  const locales = await loadLocales("en");
  translatorProcessor.processTranslations(locales, ["es", "fr"]);
}

main();
