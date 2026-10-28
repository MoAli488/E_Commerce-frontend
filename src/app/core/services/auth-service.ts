import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { enviroment } from '../../../../enviroment/env';
import { BehaviorSubject, tap } from 'rxjs';
import { ILoginReq, ILoginRes, ISignupReq, IToken } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';

@Service()
export class AuthService {
  private _httpClient = inject(HttpClient);
  private _apiURL = enviroment.apiURL + 'auth/';
  private _router = inject(Router);

  private userData = new BehaviorSubject<IToken | null>(this.getInitialUser());

  getUserData() {
    return this.userData.asObservable();
  }

  private getInitialUser(): IToken | null {
    const token = this.getToken();
    if (token) {
      const decode = this.decodeToken(token);
      if (decode?.exp && Date.now() < decode.exp * 1000) {
        return decode;
      }
      localStorage.removeItem('token');
    }
    return null;
  }

  login(data: ILoginReq) {
    return this._httpClient.post<ILoginRes>(this._apiURL + 'login', data).pipe(
      tap((res) => {
        if (res.token) {
          const userInfo = this.decodeToken(res.token);
          if (userInfo) {
            this.saveToken(res.token);
            this.userData.next(userInfo);
            if (userInfo.role === 'admin')
              this._router.navigate(['/dashboard']);
            else this._router.navigate(['/']);
          }
        }
      }),
    );
  }

  signup(data: ISignupReq) {
    return this._httpClient.post<ILoginRes>(this._apiURL + 'signup', data).pipe(
      tap((res) => {
        const decode = this.decodeToken(res.token);
        if (!decode) return alert('Something went wrong!');
        this.saveToken(res.token);
        this.userData.next(decode);
        return this._router.navigate(['/']);
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userData.next(null);
    // this._router.navigate(['/']);
  }

  checkIfLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      const decode = this.decodeToken(token);
      if (decode?.exp) {
        const expireDate = decode.exp * 1000;
        if (Date.now() < expireDate) {
          if (!this.userData.value) {
            this.userData.next(decode);
          }
          return true;
        }
      }
    }
    return false;
  }

  ifAuthorized(role: string) {
    const token = this.getToken();
    if (token) {
      const decode = this.decodeToken(token);
      if (decode?.exp) {
        const expiryDate = decode.exp * 1000;
        if (Date.now() < expiryDate) {
          if (decode.role == role) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  private saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  private decodeToken(token: string): IToken | null {
    try {
      return jwtDecode<IToken>(token);
    } catch (e) {
      return null;
    }
  }
}
