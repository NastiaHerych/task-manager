import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { AuthService } from '../services/authorization/auth.service';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Route } from '../enums/route.enum';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let authReq = req;
    const token = this.authService.getToken();
    if (token != null) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      });
    }
    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error.status == HttpStatusCode.Unauthorized) {
          this.router
            .navigate([Route.LOGIN], { skipLocationChange: true })
            .then(() => this.authService.removeToken());
        }
        return throwError(error.error);
      })
    );
  }
}
