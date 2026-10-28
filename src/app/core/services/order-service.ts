import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enviroment } from '../../../../enviroment/env';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

export interface IOrderRes {
  message: string;
  data: Order;
}

export interface IOrderListRes {
  message: string;
  data: Order[];
}

export interface IMakeOrderReq {
  phone?: string;
  address?: string;
  addressId?: string;
}

export interface IUpdateOrderStatusReq {
  id: string;
  status: string;
}

@Service()
export class OrderService {
  private _httpClient = inject(HttpClient);
  private readonly _apiURL = enviroment.apiURL + 'order';

  /** Admin: get all orders */
  getAllOrders(): Observable<IOrderListRes> {
    return this._httpClient.get<IOrderListRes>(this._apiURL);
  }

  /** User: get their own orders */
  getUserOrders(userId: string): Observable<IOrderListRes> {
    return this._httpClient.get<IOrderListRes>(`${this._apiURL}/${userId}`);
  }

  /** User: place an order from the current cart */
  makeOrder(data: IMakeOrderReq): Observable<IOrderRes> {
    return this._httpClient.post<IOrderRes>(`${this._apiURL}/create-order`, data);
  }

  /** User/Admin: update an order status */
  updateOrderStatus(data: IUpdateOrderStatusReq): Observable<IOrderRes> {
    return this._httpClient.put<IOrderRes>(`${this._apiURL}/update-order`, data);
  }
}
