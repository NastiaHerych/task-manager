import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from 'src/app/shared/enums/route.enum';
import { StorageKeyEnum } from 'src/app/shared/enums/storage-key.enum';
import { LoginService } from 'src/app/shared/services/authorization/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe((value) => {
        console.log('Login Successful');
        this.router
          .navigate(['../' + Route.PROJECTS], {
            relativeTo: this.route,
          })
          .then(() => {
            sessionStorage.setItem(
              StorageKeyEnum.CUSTOMER_DATA,
              JSON.stringify(value)
            );
          }); // Navigate to protected page on success
      });
    }
  }
}
