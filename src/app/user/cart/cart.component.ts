import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { UserHomeNavigationComponent } from '../userhome-navigation.component';
import { UserhomeComponent } from '../userhome/userhome.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderConfirmDialogComponent } from './order-confirm-dialog/order-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [UserHomeNavigationComponent, UserhomeComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = []; 
  selectedTotalPrice: number = 0; 

  constructor(private dataService: DataService, private dialog: MatDialog , private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCart();
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  loadCart(): void {
    if (this.isLoggedIn()) {
      this.dataService.getCart().subscribe({
        next: (response) => {
          if (response && response.code === 200) {
            this.cartItems = response.data.map((item: any) => ({ ...item, selected: false }));
            this.updateTotalPrice();
            this.updateCartItemCount();
            this.cdr.detectChanges(); 
          } else {
            console.error('No items found in the cart');
          }
        },
        error: (err) => {
          console.error('Error loading cart:', err.message || err);
        }
      });
    } else {
      console.error('User is not logged in');
    }
  }
  

  changeQuantity(productId: number, newQuantity: number): void {
    if (newQuantity < 1) return;
  
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = user.id;
  
    const selectedItem = this.cartItems.find(item => item.productId === productId);
  
    this.dataService.updateCart({ user_id: userId, product_id: productId, quantity: newQuantity }).subscribe({
      next: (response) => {
        if (response && response.success) {
          if (selectedItem) {
            selectedItem.quantity = newQuantity;
            this.updateTotalPrice();
          }
        } else {
          console.error('Failed to update cart:', response.error);
        }
      },
      error: (err) => {
        console.error('Error updating cart:', err.message || err);
      }
    });
  }
  

  calculateTotalPrice(price: number, quantity: number): number {
    return price * quantity;
  }

  updateTotalPrice(): void {
    this.selectedTotalPrice = this.cartItems
      .filter((item: any) => item.selected)
      .reduce((acc, item) => acc + this.calculateTotalPrice(item.price, item.quantity), 0);
  }

  updateCartItemCount(): void {
    const cartNavComponent = document.querySelector('app-userhome-navigation') as any;
    if (cartNavComponent) {
      cartNavComponent.cartItemCount = this.cartItems.length; 
    }
  }
  removeFromCart(productId: number): void {
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    
    this.dataService.removeFromCart({ user_id: userId, product_id: productId }).subscribe({
      next: () => {
        console.log('Product removed from cart');
        this.loadCart(); 
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error:', err)
    });
  }
    

  orderNow(): void {

    const selectedItems = this.cartItems.filter(item => item.selected);
  
    if (selectedItems.length === 0) {
      this.snackBar.open('No items selected for ordering', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }
    
    const dialogRef = this.dialog.open(OrderConfirmDialogComponent, {
      width: '700px',
      data: { cartItems: selectedItems, totalPrice: this.selectedTotalPrice }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartItems = this.cartItems.filter(item => !item.selected);
        this.selectedTotalPrice = 0;
        this.updateCartItemCount();
      }
    });
  }
  
  
}
