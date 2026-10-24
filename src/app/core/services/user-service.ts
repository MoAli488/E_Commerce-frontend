import { inject, Service } from '@angular/core';
import { enviroment } from '../../../../enviroment/env';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser, IUserListRes, IUserRes } from '../models/user.model';

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

  // TODO: rest of the APIs
}
