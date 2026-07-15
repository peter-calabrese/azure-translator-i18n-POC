
type TranslationEntry = {
  text: string;
};

type TranslationResult = {
  translations: {
    text: string;
    to: string;
  }[];
};

export class AzureTranslationService {

   async  translateObject(
     text: TranslationEntry[],
     targetLanguages: string[],
   ): Promise<TranslationResult[]> {
    const response = await fetch(
      "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en" +
        targetLanguages.map((lang) => `&to=${lang}`).join(""),
      {
        body: JSON.stringify(text.map((entry) => ({ text: entry.text }))),
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.TRANSLATOR_KEY || "",
          "Ocp-Apim-Subscription-Region": process.env.TRANSLATOR_REGION || "",
        },
        method: "POST",
      },
    );

    if (!response.ok) {
        throw new Error(`Translation API request failed with status ${response.status}`);
    }

    const translations = await response.json() as TranslationResult[];

    return translations;
   }
}