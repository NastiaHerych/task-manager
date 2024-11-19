import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from 'src/app/shared/enums/language.enum';
import { StorageKeyEnum } from 'src/app/shared/enums/storage-key.enum';
import { CustomerDataModel } from 'src/app/shared/models/customer-data.model';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
})
export class LanguagesComponent implements OnInit {
  public selectedLanguage: LanguageEnum = LanguageEnum.EN;
  public LanguageEnum = LanguageEnum;

  @Input() customerData: CustomerDataModel;

  public languageMap = {
    [LanguageEnum.EN]: 'English',
    [LanguageEnum.FR]: 'French',
    [LanguageEnum.ES]: 'Spanish',
  };

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    if (this.customerData._id) {
      // Fetch user's language preference from the backend
      this.languageService.getUserLanguage(this.customerData._id).subscribe({
        next: (response) => {
          this.selectedLanguage = response.language || LanguageEnum.EN;
          this.translate.use(this.selectedLanguage);
        },
        error: () => {
          console.error('Failed to fetch user language from backend');
          this.translate.use(LanguageEnum.EN);

          this.translate.use(LanguageEnum.EN);
        },
      });
    } else {
      // Default to English if no user ID is found
      this.translate.use(LanguageEnum.EN);
    }
  }

  changeLanguage(language: LanguageEnum): void {
    this.selectedLanguage = language;
    this.translate.use(language);
    sessionStorage.setItem(StorageKeyEnum.LANGUAGE, language);
    if (this.customerData._id) {
      this.languageService
        .updateUserLanguage(this.customerData._id, language)
        .subscribe();
    }
  }
}
