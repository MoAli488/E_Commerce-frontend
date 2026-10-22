import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { IProduct } from '../../../core/models/product.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { enviroment } from '../../../../../enviroment/env';

@Component({
  imports: [RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  private _productService = inject(ProductService);
  private _activatedRoute = inject(ActivatedRoute);
  private _cdr = inject(ChangeDetectorRef);
  staticURL = enviroment.staticURL;
  myProduct!: IProduct;
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
}
