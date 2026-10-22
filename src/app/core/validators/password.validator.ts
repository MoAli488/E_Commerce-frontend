import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export class PasswordValidator {
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const hasNumbers = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[^a-zA-Z0-9]/.test(value);
      const isValidLength = value.length >= 8;
      const isValid =
        hasNumbers && hasUpper && hasLower && hasSpecial && isValidLength;
      return !isValid ? { passwordStrength: true } : null;
    };
  }
  static passwordMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const confirmPassword = control.value;
      const password = control.parent?.get('password')?.value;
      if (!confirmPassword) return null;
      return confirmPassword != password ? { dismatch: true } : null;
    };
  }
}
