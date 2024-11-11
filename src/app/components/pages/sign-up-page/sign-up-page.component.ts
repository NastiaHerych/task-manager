import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from 'src/app/shared/enums/route.enum';
import { UserRole } from 'src/app/shared/enums/user-role.enum';
import { SignUpService } from 'src/app/shared/services/authorization/signup.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
})
export class SignUpPageComponent {
  signUpForm: FormGroup;
  submitted = false;
  userRoles = UserRole;

  constructor(
    private fb: FormBuilder,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.signUpForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    if (this.signUpForm.valid) {
      this.signUpService.signUp(this.signUpForm.value).subscribe({
        next: (response) => {
          console.log('Sign-Up Successful:', response);
          this.router
            .navigate([Route.LOGIN], {
              relativeTo: this.route,
            })
            .then(() => {});;
        },
        error: (error) => {
          console.error('Sign-Up Error:', error);
        },
      });
    }
  }
}
