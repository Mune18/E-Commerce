import { Component, OnInit, ViewChild } from '@angular/core';
import { UserHomeNavigationComponent } from '../userhome-navigation.component';
import { DataService } from '../../service/data.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../service/cart.service';


export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  timestamp?: number; // Optional timestamp property
}

@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [UserHomeNavigationComponent, CommonModule, RouterModule],
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.css'],
  providers: [CurrencyPipe]
})
export class UserhomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = 'all';


  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private cartService: CartService // Inject the CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.dataService.loadProducts().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.products = response.data.map((product: any) => ({
            ...product,
            timestamp: new Date().getTime()
          }));
          this.filteredProducts = this.products;
        } else {
          console.error('No products found');
        }
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => product.category === category);
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  addToCart(productId: number): void {
    if (this.isLoggedIn()) {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = user.id;
      const quantity = 1;

      const cartData = { userId, productId, quantity };

      this.dataService.addToCart(cartData).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.snackBar.open('Product added to cart', 'Close', { duration: 3000 });
            this.cartService.notifyCartUpdate(); // Notify cart update
          } else {
            console.error('Error adding product to cart:', response.error);
          }
        },
        error: (err) => {
          console.error('Error adding product to cart:', err);
        }
      });
    } else {
      alert('Please log in to add products to your cart.');
    }
  }

  onSearch(query: string) {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    console.error(`Image failed to load: ${target.src}`);
    target.src = 'assets/default-image.png';
  }
}
