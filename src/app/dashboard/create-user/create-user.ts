import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user-service';

@Component({
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  selector: 'app-create-user',
  styleUrl: './create-user.css',
  templateUrl: './create-user.html',
})
export class CreateUser {
  private _userService = inject(UserService);

  isSubmitting = signal(false);
  statusMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  userForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    role: new FormControl<'user' | 'admin'>('user', { nonNullable: true }),
  });

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.statusMessage.set(null);

    const { name, email, password, role } = this.userForm.value;
    this._userService.addUser({ name: name!, email: email!, password: password!, role }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.statusMessage.set({ type: 'success', text: 'User created successfully!' });
        this.userForm.reset({ role: 'user' });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.statusMessage.set({
          type: 'error',
          text: err?.error?.message || 'Failed to create user.',
        });
      },
    });
  }
}
