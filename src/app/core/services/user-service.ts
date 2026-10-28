import { inject, Service } from '@angular/core';
import { enviroment } from '../../../../enviroment/env';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser, IUserListRes, IUserRes } from '../models/user.model';
import { IAddress } from '../models/address.model';

export interface IAddUserReq {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface IUpdateUserReq {
  name?: string;
  email?: string;
  phone?: string;
}

export interface IAddressRes {
  message: string;
  data: IAddress[];
}

@Service()
export class UserService {
  private _httpClient = inject(HttpClient);
  private readonly _apiURL = enviroment.apiURL + 'user';

  getAllUsers(): Observable<IUserListRes> {
    return this._httpClient.get<IUserListRes>(this._apiURL);
  }

  getUserByEmail(email: string): Observable<IUserRes> {
    return this._httpClient.get<IUserRes>(`${this._apiURL}/${email}`);
  }

  addUser(data: IAddUserReq): Observable<IUserRes> {
    return this._httpClient.post<IUserRes>(this._apiURL, data);
  }

  updateUser(id: string, data: IUpdateUserReq): Observable<IUserRes> {
    return this._httpClient.put<IUserRes>(`${this._apiURL}/${id}`, data);
  }

  deleteUser(id: string): Observable<IUserRes> {
    return this._httpClient.delete<IUserRes>(`${this._apiURL}/${id}`);
  }

  // Address endpoints
  getAddresses(): Observable<{ data: IAddress[] }> {
    return this._httpClient.get<{ data: IAddress[] }>(`${this._apiURL}/address`);
  }

  addAddress(data: { title?: string; location: string; isDefault?: boolean }): Observable<{ message: string; data: IAddress }> {
    return this._httpClient.post<{ message: string; data: IAddress }>(`${this._apiURL}/address`, data);
  }

  updateAddress(id: string, data: { title?: string; location?: string; isDefault?: boolean }): Observable<{ message: string; data: IAddress }> {
    return this._httpClient.patch<{ message: string; data: IAddress }>(`${this._apiURL}/address/${id}`, data);
  }

  deleteAddress(id: string): Observable<{ message: string; data: { id: string } }> {
    return this._httpClient.delete<{ message: string; data: { id: string } }>(`${this._apiURL}/address/${id}`);
  }
}
