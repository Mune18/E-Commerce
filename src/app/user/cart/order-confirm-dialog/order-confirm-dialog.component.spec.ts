import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmDialogComponent } from './order-confirm-dialog.component';

describe('OrderConfirmDialogComponent', () => {
  let component: OrderConfirmDialogComponent;
  let fixture: ComponentFixture<OrderConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderConfirmDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
