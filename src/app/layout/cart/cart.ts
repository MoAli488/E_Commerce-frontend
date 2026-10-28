import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart-service';
import { ICart, ICartItem, ICartReq } from '../../core/models/cart.model';
import { enviroment } from '../../../../enviroment/env';
import { AuthService } from '../../core/services/auth-service';

@Component({
  imports: [RouterLink, CurrencyPipe],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart implements OnInit, OnDestroy {
  private _cartService = inject(CartService);
  private _authService = inject(AuthService);

  // guestCart: ICartItem[] = [];
  loggedIn: boolean = this._authService.ifAuthorized('user');
  cart!: ICart;
  isLoading = signal(true);
  error = signal<string | null>(null);
  updatingItemId = signal<string | null>(null);
  staticURL = enviroment.staticURL;

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    if (!this.loggedIn && this.cart) {
      this._cartService.saveGuestCart(this.cart);
    }
  }

  loadCart() {
    if (!this._authService.ifAuthorized('user')) {
      this.loggedIn = false;
      this.cart = this._cartService.getGuestCart() || {
        _id: 'guest',
        user: 'guest',
        cartItems: [],
      };
      this.isLoading.set(false);
      return;
    }
    this.loggedIn = true;
    this._cartService.getCart()?.subscribe({
      next: (res) => {
        this.cart = res.data;
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load cart. Please try again.');
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }

  get cartItems(): ICartItem[] {
    return this.cart?.cartItems ?? [];
  }

  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.item.price * item.quantity,
      0,
    );
  }

  get itemCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateQuantity(cartItem: ICartItem, delta: number) {
    const newQty = cartItem.quantity + delta;
    if (newQty < 1) return;
    this.updatingItemId.set(cartItem._id);

    if (!this.loggedIn) {
      this.cart = this._cartService.updateGuestCartItem(cartItem._id, newQty);
      this.updatingItemId.set(null);
      return;
    }

    this._cartService.updateItem(cartItem._id, newQty).subscribe({
      next: (res) => {
        this.cart = res.data;
        this.updatingItemId.set(null);
      },
      error: (err) => {
        console.error(err);
        this.updatingItemId.set(null);
      },
    });
  }

  removeItem(cartItem: ICartItem) {
    this.updatingItemId.set(cartItem._id);

    if (!this.loggedIn) {
      this.cart = this._cartService.removeGuestCartItem(cartItem._id);
      this.updatingItemId.set(null);
      return;
    }

    this._cartService.removeItem(cartItem._id).subscribe({
      next: (res) => {
        this.cart = res.data;
        this.updatingItemId.set(null);
      },
      error: (err) => {
        console.error(err);
        this.updatingItemId.set(null);
      },
    });
  }

  clearCart() {
    this.isLoading.set(true);
    this._cartService.removeGuestCart();

    if (!this.loggedIn) {
      this.cart = { _id: 'guest', user: 'guest', cartItems: [] };
      this.isLoading.set(false);
      return;
    }

    this._cartService.clearCart().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.loadCart();
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}
