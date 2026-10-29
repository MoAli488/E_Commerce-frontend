import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product-service';
import { IProduct } from '../../core/models/product.model';
import { ICategory } from '../../core/models/category.model';
import { enviroment } from '../../../../enviroment/env';
import { Product } from './product/product';

@Component({
  imports: [Product, FormsModule],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private _productService = inject(ProductService);
  private _cdr = inject(ChangeDetectorRef);

  products = signal<IProduct[]>([]);
  categories = signal<ICategory[]>([]);
  selectedCategory = signal<string>('all');
  searchQuery = signal<string>('');
  selectedPriceRange = signal<string>('all');

  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  limit = 8;

  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const params: {
      page: number;
      limit: number;
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
    } = {
      page: this.currentPage(),
      limit: this.limit,
    };

    if (this.searchQuery().trim()) {
      params.search = this.searchQuery().trim();
    }

    if (this.selectedCategory() !== 'all') {
      params.category = this.selectedCategory();
    }

    if (this.selectedPriceRange() === 'under50') {
      params.maxPrice = 50;
    } else if (this.selectedPriceRange() === '50to100') {
      params.minPrice = 50;
      params.maxPrice = 100;
    } else if (this.selectedPriceRange() === 'over100') {
      params.minPrice = 100;
    }

    this._productService.getAllProducts(params).subscribe({
      next: (res) => {
        this.products.set(res.data);
        if (res.totalPages) {
          this.totalPages.set(res.totalPages);
        } else {
          this.totalPages.set(1);
        }

        // Extract categories if list is empty
        if (this.categories().length === 0 && res.data.length > 0) {
          const catMap = new Map<string, ICategory>();
          res.data.forEach((p) => {
            if (p.category?.slug) {
              catMap.set(p.category.slug, p.category);
            }
          });
          this.categories.set(Array.from(catMap.values()));
        }

        this.loading.set(false);
        this._cdr.detectChanges();
      },
      error: (err) => {
        if (!enviroment.isProduction) console.error(err);
        this.errorMessage.set(
          'Could not load products. Please check back shortly.',
        );
        this.loading.set(false);
        this._cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.fetchProducts();
  }

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
    this.currentPage.set(1);
    this.fetchProducts();
  }

  selectPriceRange(range: string): void {
    this.selectedPriceRange.set(range);
    this.currentPage.set(1);
    this.fetchProducts();
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('all');
    this.selectedPriceRange.set('all');
    this.currentPage.set(1);
    this.fetchProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage())
      return;
    this.currentPage.set(page);
    this.fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pagesArray(): number[] {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}
