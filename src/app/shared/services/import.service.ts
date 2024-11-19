import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private baseUrl = 'http://localhost:3000/api/tasks';
  constructor(private http: HttpClient) {}

  // Import tasks by uploading a file
  importTasks(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    // Send file to the backend
    return this.http.post(`${this.baseUrl}/import-tasks`, formData);
  }
}
