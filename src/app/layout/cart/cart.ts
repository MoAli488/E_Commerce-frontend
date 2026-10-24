import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart-service';
import { ICart, ICartItem } from '../../core/models/cart.model';
import { enviroment } from '../../../../enviroment/env';

@Component({
  imports: [RouterLink, CurrencyPipe],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart implements OnInit {
  private _cartService = inject(CartService);

  cart = signal<ICart | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  staticURL = enviroment.staticURL;

  ngOnInit(): void {
    this._cartService.getCart()?.subscribe({
      next: (res) => {
        this.cart.set(res.data);
        this.isLoading.set(false);
        console.log('res:' + res.data);
      },
      error: (err) => {
        this.error.set('Failed to load cart. Please try again.');
        this.isLoading.set(false);
        console.error(err);
      },
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

  get itemCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}
