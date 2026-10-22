import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enviroment } from '../../../../enviroment/env';
import {
  IProduct,
  IProductReq,
  IProductRes,
  IProductsListRes,
} from '../models/product.model';

@Service()
export class ProductService {
  private _httpClient = inject(HttpClient);
  private readonly _apiURL = enviroment.apiURL + 'product';

  getAllProducts() {
    return this._httpClient.get<IProductsListRes>(this._apiURL);
  }

  getProductBySlug(slug: string) {
    return this._httpClient.get<IProductRes>(`${this._apiURL}/${slug}`);
  }

  addProduct(data: FormData) {
    return this._httpClient.post<IProductRes>(this._apiURL, data);
  }
}
