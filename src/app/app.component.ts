import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from './shared/enums/language.enum';
import { StorageKeyEnum } from './shared/enums/storage-key.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang(LanguageEnum.EN);
    translate.use(
      localStorage.getItem(StorageKeyEnum.LANGUAGE) || LanguageEnum.EN
    );
  }
}
