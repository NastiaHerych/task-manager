import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageEnum } from '../enums/language.enum';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  // Sends a PUT request to update the user's language preference in the backend
  updateUserLanguage(userId: string, language: LanguageEnum): Observable<any> {
    return this.http.put(`${this.baseUrl}/language`, { userId, language });
  }

  getUserLanguage(userId: string): Observable<{ language: LanguageEnum }> {
    return this.http.get<{ language: LanguageEnum }>(
      `${this.baseUrl}/${userId}/language`
    );
  }
}
