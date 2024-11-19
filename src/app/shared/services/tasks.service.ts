import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private baseUrl = 'http://localhost:3000/api/tasks';
  tasks$ = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient) {}

  getTasksByProjects(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}`).pipe(
      tap((response) => {
        if (response.success) {
          this.tasks$.next(response.userInfo);
        }
      })
    );
  }

  updateTaskStatus(taskId: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${taskId}/status`, { status });
  }

  addTasksToDatabase(tasks: any[]): Observable<any> {
    return new Observable((observer) => {
      for (const task of tasks) {
        this.http.post(`${this.baseUrl}/create`, task).subscribe(
          (response) => {
            observer.next(response);
          },
          (error) => {
            observer.error(error);
          }
        );
      }
    });
  }
}
