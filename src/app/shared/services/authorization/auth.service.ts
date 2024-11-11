import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { StorageKeyEnum } from '../../enums/storage-key.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token$ = new BehaviorSubject<string | null>(
    sessionStorage.getItem(StorageKeyEnum.JWT)
  );

  constructor() {
    this.token$.subscribe((token) => {
      if (token) {
        return sessionStorage.setItem(StorageKeyEnum.JWT, token);
      }
      return sessionStorage.removeItem(StorageKeyEnum.JWT);
    });
  }

  getToken() {
    return this.token$.getValue();
  }

  removeToken() {
    this.token$.next(null);
    return true;
  }
}
