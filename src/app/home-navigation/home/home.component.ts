import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/data.service';
import { HomeNavigationComponent } from '../home-navigation.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HomeNavigationComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = []; // Array to store products
  filteredProducts: any[] = [];
  selectedCategory: string = 'all';
  
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.dataService.loadProducts().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.products = response.data; // Assign products data
          this.filteredProducts = this.products; // Initialize filtered products
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

  onSearch(query: string) {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}
