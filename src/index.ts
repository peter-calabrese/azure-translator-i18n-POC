import { flattenTranslations } from "./flattenTranslations.js";

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

console.log(flattenTranslations(translations).map(
    entry => ({ Text: entry.text })
));

