import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ICategory } from '../../core/models/category.model';
import { enviroment } from '../../../../enviroment/env';
import { IProduct } from '../../core/models/product.model';
import { RouterLink } from '@angular/router';
import { Testimonial } from '../testimonial/testimonial';
import { ProductService } from '../../core/services/product-service';

@Component({
  imports: [NgClass, RouterLink, Testimonial],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private _productService = inject(ProductService);

  activeCategory = 'all';
  staticURL = enviroment.staticURL;
  categories: ICategory[] = [];
  sampleProducts: IProduct[] = [];

  ngOnInit(): void {
    this._productService.getAllProducts({ limit: 8 }).subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.sampleProducts = res.data;
          // Extract unique categories
          const categoryMap = new Map<string, ICategory>();
          res.data.forEach((p) => {
            if (p.category && p.category.slug) {
              categoryMap.set(p.category.slug, p.category);
            }
          });
          this.categories = [
            { _id: 'all', name: 'All Pieces', slug: 'all' } as ICategory,
            ...Array.from(categoryMap.values()),
          ];
        }
      },
      error: (err) => console.error('Failed to load home products:', err),
    });
  }

  get displayedProducts(): IProduct[] {
    if (!this.sampleProducts) return [];
    if (!this.activeCategory || this.activeCategory === 'all') {
      return this.sampleProducts;
    }
    return this.sampleProducts.filter(
      (p) => p.category?.slug === this.activeCategory,
    );
  }

  doActive(category: ICategory) {
    this.activeCategory = category.slug;
  }
}
