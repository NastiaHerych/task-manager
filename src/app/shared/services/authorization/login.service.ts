import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { StorageKeyEnum } from '../../enums/storage-key.enum';
import { CustomerDataModel } from '../../models/customer-data.model';
import { LoginResponseModel } from '../../models/response/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = 'http://localhost:3000';
  customerData$ = new BehaviorSubject<CustomerDataModel | null>(null);

  constructor(private http: HttpClient) {}

  login(credentials: CustomerDataModel): Observable<LoginResponseModel> {
    return this.http.post(`${this.baseUrl}/api/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.success) {
          sessionStorage.setItem(StorageKeyEnum.JWT, response.token); // Save the JWT token
          this.customerData$.next(response.userInfo);
        }
      })
    );
  }

  logout() {
    sessionStorage.removeItem(StorageKeyEnum.JWT);
  }

  getUserDataByToken(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/users/user`).pipe(
      tap((response) => {
        if (response.success) {
          this.customerData$.next(response.userInfo); // Update customer data
        }
      })
    );
  }
}
