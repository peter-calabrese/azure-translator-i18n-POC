type TranslationEntry = {
    text: string;
}

export async function translateObject(text: TranslationEntry[], targetLanguages: string[]): Promise<void> {
    console.log(process.env.TRANSLATOR_KEY)
    fetch("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en" + targetLanguages.map(lang => `&to=${lang}`).join(''),{
        body: JSON.stringify(text.map(entry => ({ text: entry.text }))),
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.TRANSLATOR_KEY || "",
            "Ocp-Apim-Subscription-Region": process.env.TRANSLATOR_REGION || ""
        },
        method: "POST"
    }).then(response => response.json()).then(data => {
        console.log(JSON.stringify(data, null, 2))
    })
    // console.log("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0" + targetLanguages.map(lang => `&to=${lang}`).join(''))
}