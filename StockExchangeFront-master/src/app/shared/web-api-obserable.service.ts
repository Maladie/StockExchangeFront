import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RegisterData } from '../register/register-data';
import { LoginData } from '../login/login-data';
import { ResponseInfo } from './response-info';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Stock } from './stock';

@Injectable()
export class WebApiObservableService {
    JSONHeader = new HttpHeaders().append('Content-Type', 'application/json');
    constructor(private _http: HttpClient) { }

    addNewUserJSON(registerData: RegisterData) {
        return this._http.post(environment.serverEndpoint + environment.registerEndpoint, registerData);
    }

    loginToWebApi(loginData: LoginData) {
      const h = new HttpHeaders().append('Authorization', 'Basic ' + btoa(loginData.username + ':' + loginData.password))
        .append('Content-Type', 'application/json');
      return this._http
        .post<ResponseInfo>(environment.serverEndpoint + '/api/login',
          loginData,
          {
            headers: h,
            observe: 'response',
            withCredentials: true
          });
    }

    getStocks() {
      const headers = new HttpHeaders().append('Content-Type', 'application/json');
      return this._http.get(environment.serverEndpoint + environment.stocksEndopoint, { headers: headers});
    }

    getWalletStocks() {
      const headers = new HttpHeaders().append('Content-Type', 'application/json');
      return this._http.get(environment.serverEndpoint + environment.usersStocks, { headers: headers});
    }

    buyStocks(stock: Stock) {
      const headers = new HttpHeaders().append('Content-Type', 'application/json');
      return this._http.post(environment.serverEndpoint + environment.buyStockEndpoint, stock, { headers: headers});
    }

    sellStocks(stock: Stock) {
      const headers = new HttpHeaders().append('Content-Type', 'application/json');
      return this._http.post(environment.serverEndpoint + environment.sellStockEndpoint, stock, { headers: headers});
    }

    getCash() {
      const headers = new HttpHeaders().append('Content-Type', 'application/json');
      return this._http.get(environment.serverEndpoint + environment.usercash, { headers: headers});
    }
}


