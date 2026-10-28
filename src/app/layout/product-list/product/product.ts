import { Component, Input } from '@angular/core';
import { IProduct } from '../../../core/models/product.model';
import { enviroment } from '../../../../../enviroment/env';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-product',
  styleUrl: './product.css',
  templateUrl: './product.html',
})
export class Product {
  staticURL = enviroment.staticURL;
  @Input() myProduct!: IProduct;
}
