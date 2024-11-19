import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class projectsService {
  private baseUrl = 'http://localhost:3000/api/projects';
  projects$ = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient) {}

  getAllProjects(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}`).pipe(
      tap((response) => {
        if (response.success) {
          this.projects$.next(response.projects);
        }
      })
    );
  }
}
