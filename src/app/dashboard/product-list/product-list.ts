import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product-service';
import { IProduct } from '../../core/models/product.model';
import { enviroment } from '../../../../enviroment/env';

@Component({
  imports: [CurrencyPipe, NgClass, RouterLink, FormsModule],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private _productService = inject(ProductService);
  staticURL = enviroment.staticURL;

  products = signal<IProduct[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<string | null>(null);
  successMsg = signal<string | null>(null);
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this._productService.getAllProducts().subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products.');
        this.isLoading.set(false);
      },
    });
  }

  get filteredProducts(): IProduct[] {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.products();
    return this.products().filter((p) =>
      p.title.toLowerCase().includes(term),
    );
  }

  deleteProduct(product: IProduct) {
    if (!confirm(`Delete "${product.title}"?`)) return;
    this.deletingId.set(product._id);
    this._productService.deleteProduct(product._id).subscribe({
      next: () => {
        this.products.update((list) => list.filter((p) => p._id !== product._id));
        this.deletingId.set(null);
        this.successMsg.set(`"${product.title}" deleted.`);
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => {
        this.deletingId.set(null);
        this.error.set(err?.error?.message || 'Failed to delete product.');
      },
    });
  }
}
