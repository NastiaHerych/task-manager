import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private baseUrl = 'http://localhost:3000/api/projects';
  projects$ = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient) {}

  // Fetch all projects
  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getAllProjects(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}`).pipe(
      tap((response) => {
        if (response.success) {
          this.projects$.next(response.projects);
        }
      })
    );
  }

  addProject(projectData: {
    name: string;
    created_by: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, projectData);
  }
}
