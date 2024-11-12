import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginService } from '../services/authorization/login.service';
import { StorageKeyEnum } from '../enums/storage-key.enum';

export const CustomerDataResolver: ResolveFn<any> = () => {
  const loginService = inject(LoginService);
  const token = sessionStorage.getItem(StorageKeyEnum.JWT);

  if (token) {
    return loginService.getUserDataByToken().pipe(
      map((response) => {
        if (response.success) {
          loginService.customerData$.next(response.userInfo);
          console.log('r', response.userInfo);
          return response.userInfo;
        }
        return null;
      }),
      catchError(() => of(null)) // Handle errors by returning null
    );
  }
  return of(null); // Return null if no token is found
};
