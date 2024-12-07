import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../service/cart.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-userhome-navigation',
  templateUrl: './userhome-navigation.component.html',
  styleUrls: ['./userhome-navigation.component.css']
})
export class UserHomeNavigationComponent implements OnInit {
  currentUsername: string = '';
  searchQuery: string = '';
  cartItemCount: number = 0;

  @Output() search = new EventEmitter<string>();
  @Input() cartUpdated: EventEmitter<void> = new EventEmitter<void>();
  

  constructor(private dataService: DataService, private router: Router, private cartService: CartService ) {}

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUsername = currentUser.name || 'User';
    this.loadCartItemCount();
    
    // Subscribe to the cartUpdated event
    this.cartService.cartUpdated$.subscribe(() => this.loadCartItemCount());
  }

  loadCartItemCount() {
    if (this.isLoggedIn()) {
      this.dataService.getCart().subscribe({
        next: (response) => {
          if (response && response.code === 200) {
            this.cartItemCount = response.data.length;
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

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }

  searchProducts() {
    this.search.emit(this.searchQuery);
  }

  updateCartCount() {
    this.loadCartItemCount(); // Refresh the cart count
  }
}
