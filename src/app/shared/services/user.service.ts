import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  // Fetch users by role
  getUsersByRole(role: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users-role?role=${role}`);
  }
}
