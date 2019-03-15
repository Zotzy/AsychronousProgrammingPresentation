import { Injectable } from '@angular/core';
import { Stock } from '../models/stock';

import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private basepath = 'stocks';

  private stockCollection: AngularFirestoreCollection<Stock>;
  private stocks: Observable<Stock[]>;

  constructor(private afs: AngularFirestore) {
    this.stockCollection = afs.collection<Stock>(this.basepath);
    this.stocks = this.stockCollection.valueChanges();
  }

  /**
   * Get a listing of stocks from the firestore collection
   * @returns Observable<Stock[]>
   */
  getStockList(): Observable<Stock[]> {
    return this.stocks;
  }
}
