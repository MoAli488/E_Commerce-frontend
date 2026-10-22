import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product-service';
import { IProduct } from '../../core/models/product.model';
import { enviroment } from '../../../../enviroment/env';
import { Product } from './product/product';

@Component({
  imports: [Product],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private _productService = inject(ProductService);
  private _cdr = inject(ChangeDetectorRef);
  products!: IProduct[];
  errorMessage: string | null = null;
  loading = true;
  ngOnInit(): void {
    this._productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        console.log(this.products);
        this.loading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        if (!enviroment.isProduction)
          console.error(`Error from product list componenet: ${err}`);
        this.errorMessage = 'Something went wrong!';
      },
    });
  }
}
