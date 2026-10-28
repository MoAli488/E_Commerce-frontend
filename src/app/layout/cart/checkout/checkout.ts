import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../../core/services/order-service';
import { CartService } from '../../../core/services/cart-service';
import { AuthService } from '../../../core/services/auth-service';
import { UserService } from '../../../core/services/user-service';
import { ICart, ICartItem } from '../../../core/models/cart.model';
import { IAddress } from '../../../core/models/address.model';

@Component({
  imports: [ReactiveFormsModule, NgClass, RouterLink, CurrencyPipe],
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit {
  private _orderService = inject(OrderService);
  private _cartService = inject(CartService);
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  private _router = inject(Router);

  cart = signal<ICart | null>(null);
  addresses = signal<IAddress[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  checkoutForm = new FormGroup({
    phone: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^(\+20|0)?1[0125][0-9]{8}$/),
      ],
    }),
    addressType: new FormControl<'saved' | 'new'>('new'),
    savedAddressId: new FormControl<string>(''),
    newAddress: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  ngOnInit(): void {
    // Dynamically adjust validation based on selected address type
    this.checkoutForm.controls.addressType.valueChanges.subscribe((type) => {
      if (type === 'saved') {
        this.checkoutForm.controls.newAddress.clearValidators();
        this.checkoutForm.controls.savedAddressId.setValidators([Validators.required]);
      } else {
        this.checkoutForm.controls.savedAddressId.clearValidators();
        this.checkoutForm.controls.newAddress.setValidators([
          Validators.required,
          Validators.minLength(5),
        ]);
      }
      this.checkoutForm.controls.newAddress.updateValueAndValidity();
      this.checkoutForm.controls.savedAddressId.updateValueAndValidity();
    });

    this._cartService.getCart().subscribe({
      next: (res) => {
        this.cart.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load cart.');
        this.isLoading.set(false);
      },
    });

    this._userService.getAddresses().subscribe({
      next: (res) => {
        const list = res.data || [];
        this.addresses.set(list);
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          this.checkoutForm.patchValue({
            addressType: 'saved',
            savedAddressId: defaultAddr._id || '',
          });
          this.checkoutForm.controls.newAddress.clearValidators();
          this.checkoutForm.controls.savedAddressId.setValidators([Validators.required]);
          this.checkoutForm.controls.newAddress.updateValueAndValidity();
          this.checkoutForm.controls.savedAddressId.updateValueAndValidity();
        }
      },
      error: () => {},
    });
  }

  get cartItems(): ICartItem[] {
    return this.cart()?.cartItems ?? [];
  }

  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + (item.item?.price || 0) * item.quantity,
      0,
    );
  }

  get addressType() {
    return this.checkoutForm.controls.addressType.value;
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    if (this.cartItems.length === 0) {
      this.error.set('Your cart is empty.');
      return;
    }

    const { phone, addressType, savedAddressId, newAddress } = this.checkoutForm.value;

    const payload: { phone?: string; address?: string; addressId?: string } = {};
    if (phone) payload.phone = phone;

    if (addressType === 'saved' && savedAddressId) {
      payload.addressId = savedAddressId;
    } else if (newAddress) {
      payload.address = newAddress;
    } else {
      this.error.set('Please provide a delivery address.');
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    this._orderService.makeOrder(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.successMessage.set('Order placed successfully! 🎉');
        setTimeout(() => this._router.navigate(['/orders']), 2000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.error.set(err?.error?.message || 'Failed to place order. Please try again.');
      },
    });
  }
}
