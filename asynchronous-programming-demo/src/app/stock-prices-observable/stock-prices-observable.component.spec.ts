import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPricesObservableComponent } from './stock-prices-observable.component';

describe('StockPricesObservableComponent', () => {
  let component: StockPricesObservableComponent;
  let fixture: ComponentFixture<StockPricesObservableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockPricesObservableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockPricesObservableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
