import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockPricesObservableComponent } from './stock-prices-observable/stock-prices-observable.component';

const routes: Routes = [
    {
        path: 'stock-prices-observables',
        component: StockPricesObservableComponent
    },
    {
        path: '',
        redirectTo: '/stock-prices-observables',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
