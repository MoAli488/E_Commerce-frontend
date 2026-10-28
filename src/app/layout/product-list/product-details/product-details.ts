import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { IProduct } from '../../../core/models/product.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { enviroment } from '../../../../../enviroment/env';
import { CartService } from '../../../core/services/cart-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  imports: [RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  private _productService = inject(ProductService);
  private _cartService = inject(CartService);
  private _authService = inject(AuthService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _cdr = inject(ChangeDetectorRef);

  staticURL = enviroment.staticURL;
  myProduct!: IProduct;

  quantity = signal(1);
  isAdding = signal(false);
  addedFeedback = signal<string | null>(null);
  errorFeedback = signal<string | null>(null);

  ngOnInit(): void {
    const slug = this._activatedRoute.snapshot.paramMap.get('slug');
    if (!slug) return;
    this._productService.getProductBySlug(slug).subscribe({
      next: (res) => {
        this.myProduct = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  incrementQty() {
    if (this.quantity() < this.myProduct.stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decrementQty() {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart() {
    this.isAdding.set(true);
    this.addedFeedback.set(null);
    this.errorFeedback.set(null);

    if (!this._authService.checkIfLoggedIn()) {
      try {
        this._cartService.addGuestCartItem(this.myProduct, this.quantity());
        this.isAdding.set(false);
        this.addedFeedback.set(
          `Added ${this.quantity()} item(s) to your bag!`,
        );
        setTimeout(() => this.addedFeedback.set(null), 4500);
      } catch (err) {
        this.isAdding.set(false);
        this.errorFeedback.set('Could not add to bag.');
        setTimeout(() => this.errorFeedback.set(null), 4500);
      }
      return;
    }

    this._cartService
      .addItem({ item: this.myProduct._id, quantity: this.quantity() })
      .subscribe({
        next: () => {
          this.isAdding.set(false);
          this.addedFeedback.set(
            `Added ${this.quantity()} item(s) to your bag!`,
          );
          setTimeout(() => this.addedFeedback.set(null), 4500);
        },
        error: (err) => {
          this.isAdding.set(false);
          this.errorFeedback.set(
            err?.error?.message || 'Could not add to bag.',
          );
          setTimeout(() => this.errorFeedback.set(null), 4500);
        },
      });
  }
}
