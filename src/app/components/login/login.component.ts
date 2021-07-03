import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginError } from 'src/app/services/auth/errors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  loginGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  loading = false;

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  login(): void {
    if (this.loginGroup.invalid) {
      return;
    }
    this.loginGroup.controls.username.disable();
    this.loginGroup.controls.password.disable();
    this.loading = true;
    const form: { username: string, password: string } = this.loginGroup.getRawValue();
    this.authService.login(form.username, form.password).pipe(tap(console.log)).subscribe({
      next: () => this.router.navigateByUrl('contacts'),
      error: (errors: LoginError[]) => {
        this.loginGroup.controls.username.enable();
        this.loginGroup.controls.password.enable();

        errors.forEach(error => {
          if (error?.errorCode === 'wrong') {
            this.loginGroup.setErrors({ wrong: true });
          }
        })
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}