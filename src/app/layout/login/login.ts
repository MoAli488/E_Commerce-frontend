import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { ILoginReq } from '../../core/models/auth.model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private _authService = inject(AuthService);
  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (!this.loginForm.invalid)
      this._authService
        .login(this.loginForm.getRawValue() as ILoginReq)
        .subscribe({
          next: (res) => {
            console.log('Login success:', res);
            this.loginForm.reset();
          },
          error: (err) => {
            console.error('Login error:', err);
          },
        });
    else alert('Please fill up the form.');
  }
}
