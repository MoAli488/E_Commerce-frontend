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
      next: (res) => this.addresses.set(res.data || []),
      error: () => {},
    });
  }

  get cartItems(): ICartItem[] {
    return this.cart()?.cartItems ?? [];
  }

  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.item.price * item.quantity,
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
