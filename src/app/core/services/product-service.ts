import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enviroment } from '../../../../enviroment/env';
import {
  IProduct,
  IProductReq,
  IProductRes,
  IProductsListRes,
} from '../models/product.model';

export interface IProductUpdateReq {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  subCategory?: string;
}

@Service()
export class ProductService {
  private _httpClient = inject(HttpClient);
  private readonly _apiURL = enviroment.apiURL + 'product';

  getAllProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.minPrice !== undefined) httpParams = httpParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    }
    return this._httpClient.get<IProductsListRes>(this._apiURL, { params: httpParams });
  }

  getProductBySlug(slug: string) {
    return this._httpClient.get<IProductRes>(`${this._apiURL}/${slug}`);
  }

  addProduct(data: FormData) {
    return this._httpClient.post<IProductRes>(this._apiURL, data);
  }

  updateProduct(id: string, data: FormData) {
    return this._httpClient.put<IProductRes>(`${this._apiURL}/${id}`, data);
  }

  deleteProduct(id: string) {
    return this._httpClient.delete<IProductRes>(`${this._apiURL}/${id}`);
  }
}
