import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Observable, Subscription } from 'rxjs';
import { Stock } from '../models/stock';

@Component({
    selector: 'app-stock-prices-observable',
    templateUrl: './stock-prices-observable.component.html',
    styleUrls: ['./stock-prices-observable.component.css']
})
export class StockPricesObservableComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['symbol', 'price', 'change', 'percentChange'];

    stocks$: Observable<Stock[]>;       // stocks observable
    stocksSubscription: Subscription;   // subscription to stocks observable
    stocks: Stock[];                    // array of stocks to be displayed

    constructor(private stockService: StockService) {
        // get the stocks observable using the service
        this.stocks$ = this.stockService.getStockList();
    }

    // lifecycle hooks
    ngOnInit() {
        // subscribe to the stocks observable and update stocks array with each event
        this.stocksSubscription = this.stocks$.subscribe((stocks: Stock[]) => {
            this.stocks = stocks;
        });
    }

    ngOnDestroy() {
        this.stocksSubscription.unsubscribe();
    }
}
