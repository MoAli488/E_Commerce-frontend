import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { TitleCasePipe, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user-service';
import { AuthService } from '../../core/services/auth-service';
import { IUser } from '../../core/models/user.model';
import { IAddress } from '../../core/models/address.model';

@Component({
  imports: [TitleCasePipe, NgClass, RouterLink, ReactiveFormsModule],
  selector: 'app-user-profile',
  styleUrl: './user-profile.css',
  templateUrl: './user-profile.html',
})
export class UserProfile implements OnInit {
  private _userService = inject(UserService);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _cdr = inject(ChangeDetectorRef);

  user = signal<IUser | null>(null);
  addresses = signal<IAddress[]>([]);
  isLoading = signal(true);

  isEditingProfile = signal(false);
  isAddingAddress = signal(false);
  isSaving = signal(false);

  successMsg = signal<string | null>(null);
  errorMsg = signal<string | null>(null);

  profileForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^(\+20|0)?1[0125][0-9]{8}$/)],
    }),
  });

  addressForm = new FormGroup({
    title: new FormControl('Home', { nonNullable: true }),
    location: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    isDefault: new FormControl(false, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading.set(true);
    this._authService.getUserData().subscribe({
      next: (res) => {
        if (!res) {
          this.isLoading.set(false);
          return;
        }
        this._userService.getUserByEmail(res.email).subscribe({
          next: (data) => {
            this.user.set(data.data);
            this.profileForm.patchValue({
              name: data.data.name,
              phone: data.data.phone || '',
            });
            this.addresses.set(data.data.addresses || []);
            this.isLoading.set(false);
            this._cdr.detectChanges();
          },
          error: (err) => {
            this.errorMsg.set('Failed to load user profile.');
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  toggleEditProfile() {
    this.isEditingProfile.update((v) => !v);
    this.clearAlerts();
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const currentUser = this.user();
    if (!currentUser?._id) return;

    this.isSaving.set(true);
    this.clearAlerts();

    const { name, phone } = this.profileForm.value;
    this._userService.updateUser(currentUser._id, { name, phone }).subscribe({
      next: (res) => {
        this.user.set(res.data);
        this.isSaving.set(false);
        this.isEditingProfile.set(false);
        this.successMsg.set('Profile details updated successfully.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMsg.set(err?.error?.message || 'Failed to update profile.');
      },
    });
  }

  toggleAddAddress() {
    this.isAddingAddress.update((v) => !v);
    this.addressForm.reset({ title: 'Home', isDefault: false });
    this.clearAlerts();
  }

  saveAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.isSaving.set(true);
    this.clearAlerts();

    const { title, location, isDefault } = this.addressForm.value;
    this._userService
      .addAddress({ title, location: location!, isDefault })
      .subscribe({
        next: (res) => {
          this.addresses.update((list) => {
            if (isDefault) {
              list = list.map((a) => ({ ...a, isDefault: false }));
            }
            return [...list, res.data];
          });
          this.isSaving.set(false);
          this.isAddingAddress.set(false);
          this.addressForm.reset({ title: 'Home', isDefault: false });
          this.successMsg.set('New address added.');
          setTimeout(() => this.successMsg.set(null), 3000);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMsg.set(err?.error?.message || 'Failed to add address.');
        },
      });
  }

  setDefaultAddress(address: IAddress) {
    if (!address._id || address.isDefault) return;
    const addrId = address._id;
    this._userService
      .updateAddress(addrId, { isDefault: true })
      .subscribe({
        next: () => {
          this.addresses.update((list) =>
            list.map((a) => ({ ...a, isDefault: a._id === addrId })),
          );
          this.successMsg.set(`"${address.title || 'Address'}" set as default.`);
          setTimeout(() => this.successMsg.set(null), 3000);
        },
        error: (err) => {
          this.errorMsg.set(err?.error?.message || 'Failed to update default address.');
        },
      });
  }

  deleteAddress(address: IAddress) {
    if (!address._id) return;
    if (!confirm(`Delete address "${address.title || address.location}"?`)) return;
    const addrId = address._id;
    this._userService.deleteAddress(addrId).subscribe({
      next: () => {
        this.addresses.update((list) => list.filter((a) => a._id !== addrId));
        this.successMsg.set('Address deleted.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message || 'Failed to delete address.');
      },
    });
  }

  private clearAlerts() {
    this.successMsg.set(null);
    this.errorMsg.set(null);
  }
}
