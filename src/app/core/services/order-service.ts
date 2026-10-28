import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enviroment } from '../../../../enviroment/env';
import { Observable } from 'rxjs';
import {
  IMakeOrderReq,
  IOrderListRes,
  IOrderRes,
  IUpdateOrderStatusReq,
  Order,
} from '../models/order.model';

@Service()
export class OrderService {
  private _httpClient = inject(HttpClient);
  private readonly _apiURL = enviroment.apiURL + 'order';

  getAllOrders(): Observable<IOrderListRes> {
    return this._httpClient.get<IOrderListRes>(this._apiURL);
  }

  getUserOrders(userId: string): Observable<IOrderListRes> {
    return this._httpClient.get<IOrderListRes>(`${this._apiURL}/${userId}`);
  }

  makeOrder(data: IMakeOrderReq): Observable<IOrderRes> {
    return this._httpClient.post<IOrderRes>(
      `${this._apiURL}/create-order`,
      data,
    );
  }

  updateOrderStatus(data: IUpdateOrderStatusReq): Observable<IOrderRes> {
    return this._httpClient.put<IOrderRes>(
      `${this._apiURL}/update-order`,
      data,
    );
  }

  getOrderStats(): Observable<{
    message: string;
    data: {
      totalRevenue: number;
      totalUnitsSold: number;
      statusBreakdown: Record<string, number>;
      topProducts: Array<{
        _id: string;
        name: string;
        unitsSold: number;
        totalSales: number;
      }>;
    };
  }> {
    return this._httpClient.get<any>(`${this._apiURL}/stats`);
  }
}
