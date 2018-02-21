import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/auth.service';
import {WebApiObservableService} from '../shared/web-api-obserable.service';
import {Stock} from '../shared/stock';
import {TimerObservable} from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const timer = TimerObservable.create(1000, 10000);
    this.subscription = timer.subscribe(t => {
      if (this.isAuthenticated()) {
        this.refreshData();
      }
    });
  }

  rows: Array<Stock> = [];
  walletStocks = new Array<Stock>();
  subscription;
  cash;

  constructor(private webApi: WebApiObservableService, private _auth: AuthService) {
  }

  buy(stockIndex: number, amount: number) {
    const stock = this.rows[stockIndex];
    stock.unit = amount;
    this.webApi.buyStocks(stock).subscribe(resp => {
      // console.log(resp);
      this.rows = [];
      this.refreshData(true);
    }, err => {
      console.log(err);
      this.rows = [];
      this.refreshData();
    });
  }

  sell(stockIndex: number, amount: number) {
    const stock = this.walletStocks[stockIndex];
    stock.unit = amount;
    this.webApi.sellStocks(stock).subscribe(resp => {
      // console.log(resp);
      this.rows = [];
      this.refreshData(true);
    }, err => {
      console.log(err);
      this.rows = [];
      this.refreshData();
    });
  }

  private getUserCash() {
    this.cash = this._auth.userCash().subscribe(resp => {
      this.cash = resp;
    });
    ;
  }

  isAuthenticated() {
    const isAuthenticated = this._auth.isAuthenticated();

    if (!isAuthenticated) {
      this.rows = [];
      this.walletStocks = [];
      this.cash = null;
    }
    return isAuthenticated;
  }

  refreshData(refreshCash: boolean = false) {
    this.getStocks();
    this.getWalletStocks();
    if (refreshCash) {
      this.getUserCash();
    }
  }

  getStocks() {
    this.webApi.getStocks().subscribe(resp => {
      const stocks = resp as Array<Stock>;
      this.rows = stocks;
      // console.log(this.rows);
    }, err => {
      console.log(err);
      this.rows = [];
    });
  }

  getWalletStocks() {
    this.webApi.getWalletStocks().subscribe(resp => {
      const stocks = resp as Array<Stock>;
      this.walletStocks = stocks;
      // console.log(this.walletStocks);
    }, err => {
      console.log(err);
      this.walletStocks = new Array<Stock>();
    });
  }
}
