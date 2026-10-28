import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enviroment } from '../../../../enviroment/env';
import { ICart, ICartItem, ICartReq, ICartRes } from '../models/cart.model';
import { IProduct } from '../models/product.model';
import { BehaviorSubject, Subscription } from 'rxjs';

@Service()
export class CartService {
  private _httpClient = inject(HttpClient);
  private _apiURL = enviroment.apiURL + 'cart/';
  private _isMerging = false;

  // Localstorage reactive state
  private guestCartData = new BehaviorSubject<ICart | null>(
    this.getGuestCart(),
  );

  getCartData() {
    return this.guestCartData.asObservable();
  }

  saveGuestCart(data: ICart): void {
    try {
      localStorage.setItem('cart', JSON.stringify(data));
      this.guestCartData.next(data);
    } catch (err) {
      console.error('Error saving guest cart to localStorage:', err);
    }
  }

  getGuestCart(): ICart | null {
    try {
      const stored = localStorage.getItem('cart');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (!parsed) return null;

      if (Array.isArray(parsed)) {
        return {
          _id: 'guest',
          user: 'guest',
          cartItems: parsed,
        };
      }

      if (Array.isArray(parsed.cartItems)) {
        return parsed;
      }

      return null;
    } catch (err) {
      console.error('Error parsing guest cart from localStorage:', err);
      return null;
    }
  }

  addGuestCartItem(item: ICartItem): ICart;
  addGuestCartItem(product: IProduct, quantity?: number): ICart;
  addGuestCartItem(
    itemOrProduct: ICartItem | IProduct,
    quantity: number = 1,
  ): ICart {
    let product: IProduct;
    let qty = quantity;

    if ('item' in itemOrProduct && itemOrProduct.item) {
      product = itemOrProduct.item;
      qty = itemOrProduct.quantity ?? quantity;
    } else {
      product = itemOrProduct as IProduct;
    }

    let cart = this.getGuestCart();
    if (!cart || !Array.isArray(cart.cartItems)) {
      cart = {
        _id: 'guest',
        user: 'guest',
        cartItems: [],
      };
    }

    const existingIndex = cart.cartItems.findIndex(
      (ci) => ci.item._id === product._id,
    );

    const maxStock = product.stock !== undefined ? product.stock : Infinity;

    if (existingIndex > -1) {
      const existing = cart.cartItems[existingIndex];
      existing.quantity = Math.min(existing.quantity + qty, maxStock);
    } else {
      const newItem: ICartItem = {
        _id: 'guest_' + (product._id || Date.now().toString()),
        cart: 'guest',
        item: product,
        quantity: Math.min(qty, maxStock),
      };
      cart.cartItems.push(newItem);
    }

    this.saveGuestCart(cart);
    return cart;
  }

  updateGuestCartItem(itemId: string, quantity: number): ICart {
    let cart = this.getGuestCart();
    if (!cart || !Array.isArray(cart.cartItems)) {
      cart = { _id: 'guest', user: 'guest', cartItems: [] };
      this.saveGuestCart(cart);
      return cart;
    }

    const item = cart.cartItems.find(
      (ci) => ci._id === itemId || ci.item._id === itemId,
    );
    if (item) {
      const maxStock =
        item.item?.stock !== undefined ? item.item.stock : Infinity;
      item.quantity = Math.min(Math.max(1, quantity), maxStock);
      this.saveGuestCart(cart);
    }
    return cart;
  }

  removeGuestCartItem(itemId: string): ICart {
    let cart = this.getGuestCart();
    if (!cart || !Array.isArray(cart.cartItems)) {
      cart = { _id: 'guest', user: 'guest', cartItems: [] };
      return cart;
    }

    cart.cartItems = cart.cartItems.filter(
      (ci) => ci._id !== itemId && ci.item._id !== itemId,
    );
    this.saveGuestCart(cart);
    return cart;
  }

  removeGuestCart(): void {
    localStorage.removeItem('cart');
    this.guestCartData.next(null);
  }

  // APIs
  mergeCart(): Subscription | null {
    if (this._isMerging) return null;
    const cart: ICart | null = this.getGuestCart();
    if (cart && cart.cartItems && cart.cartItems.length > 0) {
      this._isMerging = true;
      const cartReq: ICartReq[] = cart.cartItems.map((ci) => ({
        item: ci.item._id,
        quantity: ci.quantity,
      }));
      return this.addGuestCart(cartReq).subscribe({
        next: (res) => {
          console.log('Guest Items merged');
          this.removeGuestCart();
          this._isMerging = false;
        },
        error: (err) => {
          console.error('Error merging guest cart:', err);
          this._isMerging = false;
        },
      });
    }
    return null;
  }

  getCart() {
    return this._httpClient.get<ICartRes>(this._apiURL);
  }

  addItem(data: ICartReq) {
    return this._httpClient.post<ICartRes>(this._apiURL + 'item', data);
  }

  addGuestCart(data: ICartReq[]) {
    return this._httpClient.post<ICartRes>(`${this._apiURL}item/guest`, {
      cartItems: data,
    });
  }

  updateItem(itemId: string, quantity: number) {
    return this._httpClient.put<ICartRes>(this._apiURL + `item/${itemId}`, {
      quantity,
    });
  }

  removeItem(itemId: string) {
    return this._httpClient.delete<ICartRes>(this._apiURL + `item/${itemId}`);
  }

  clearCart() {
    return this._httpClient.delete<{ message: string }>(this._apiURL);
  }
}
