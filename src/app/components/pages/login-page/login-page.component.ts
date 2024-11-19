import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Route } from 'src/app/shared/enums/route.enum';
import { UserRole } from 'src/app/shared/enums/user-role.enum';
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
        if (value) {
          if ((value.userInfo.role = UserRole.ProjectManager)) {
            this.router.navigate(['./' + Route.PROJECTS_ADMIN]);
          } else {
            this.router.navigate(['./' + Route.PROJECTS]);
          }
        }
      });
    }
  }
}
