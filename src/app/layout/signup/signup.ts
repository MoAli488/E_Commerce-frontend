import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordValidator } from '../../core/validators/password.validator';
import { AuthService } from '../../core/services/auth-service';
import { CartService } from '../../core/services/cart-service';
import { ISignupReq } from '../../core/models/auth.model';
import { NgClass } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, NgClass],
  selector: 'app-signup',
  styleUrl: './signup.css',
  templateUrl: './signup.html',
})
export class Signup {
  private _authService = inject(AuthService);
  private _cartService = inject(CartService);
  signupForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        PasswordValidator.strongPassword(),
      ],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, PasswordValidator.passwordMatch()],
    }),
  });

  onSubmit() {
    if (!this.signupForm.invalid) {
      console.log(`Data sent: ${this.signupForm.value}`);
      this._authService
        .signup(this.signupForm.getRawValue() as ISignupReq)
        .subscribe({
          next: (res) => {
            console.log('Signup success:', res);
            this._cartService.mergeCart();
            this.signupForm.reset();
          },
          error: (err) => {
            console.error('Signup error:', err);
          },
        });
    } else alert('Please fill up the form.');
  }
}
