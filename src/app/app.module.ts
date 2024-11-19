import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { SignUpPageComponent } from './components/pages/sign-up-page/sign-up-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { AppTranslateLoader } from './shared/services/app-translate-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguagesComponent } from './components/languages/languages.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { RouterModule } from '@angular/router';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddTaskModalComponent } from './components/modals/add-task-modal/add-task-modal.component';
import { AddProjectModalComponent } from './components/modals/add-project-modal/add-project-modal.component';
import { ImportPageComponent } from './components/pages/import-page/import-page.component';
import { HelpPageComponent } from './components/pages/help-page/help-page.component';
import { ManageProjectsPageComponent } from './components/pages/manage-projects-page/manage-projects-page.component';
import { ProjectTableComponent } from './components/tables/project-table/project-table.component';

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
    NavigationBarComponent,
    MainContentComponent,
    AddTaskModalComponent,
    AddProjectModalComponent,
    ImportPageComponent,
    HelpPageComponent,
    ManageProjectsPageComponent,
    ProjectTableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
