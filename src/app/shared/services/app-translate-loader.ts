import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';

const translateMap = {
  en: 'assets/i18n/en.json',
  es: 'assets/i18n/es.json',
  fr: 'assets/i18n/fr.json',
};

export class AppTranslateLoader extends TranslateLoader {
  constructor(private httpClient: HttpClient) {
    super();
  }

  getTranslation(lang: string) {
    return this.httpClient.get(translateMap[lang]);
  }
}
