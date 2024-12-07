import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Makes this service available app-wide
})
export class CartService {
  private cartUpdatedSource = new Subject<void>();
  cartUpdated$ = this.cartUpdatedSource.asObservable();

  constructor() {}

  // Method to notify subscribers about cart updates
  notifyCartUpdate() {
    this.cartUpdatedSource.next();
  }
}

