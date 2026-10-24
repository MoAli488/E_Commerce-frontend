import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enviroment } from '../../../../enviroment/env';
import { ICartReq, ICartRes } from '../models/cart.model';

@Service()
export class CartService {
  private _httpClient = inject(HttpClient);
  private _apiURL = enviroment.apiURL + 'cart/';

  getCart() {
    return this._httpClient.get<ICartRes>(this._apiURL);
  }

  addItem(data: ICartReq) {
    return this._httpClient.post<ICartRes>(this._apiURL + 'item', data);
  }
}
