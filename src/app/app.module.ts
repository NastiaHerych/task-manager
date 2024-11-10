import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { SignUpPageComponent } from './components/pages/sign-up-page/sign-up-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppTranslateLoader } from './shared/services/app-translate-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguagesComponent } from './components/languages/languages.component';
import { HeaderComponent } from './components/header/header.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new AppTranslateLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SignUpPageComponent,
    LoginPageComponent,
    LanguagesComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
