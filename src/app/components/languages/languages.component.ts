import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from 'src/app/shared/enums/language.enum';
import { StorageKeyEnum } from 'src/app/shared/enums/storage-key.enum';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
})
export class LanguagesComponent implements OnInit {
  public selectedLanguage: LanguageEnum = LanguageEnum.EN;
  public LanguageEnum = LanguageEnum;

  public languageMap = {
    [LanguageEnum.EN]: 'English',
    [LanguageEnum.FR]: 'French',
    [LanguageEnum.ES]: 'Spanish',
  };

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    const savedLanguage = sessionStorage.getItem(
      StorageKeyEnum.LANGUAGE
    ) as LanguageEnum;
    this.selectedLanguage = savedLanguage ? savedLanguage : LanguageEnum.EN;
    this.translate.use(this.selectedLanguage);
  }

  changeLanguage(language: LanguageEnum): void {
    this.selectedLanguage = language;
    this.translate.use(language);
    sessionStorage.setItem(StorageKeyEnum.LANGUAGE, language);
    window.location.reload();
  }
}
