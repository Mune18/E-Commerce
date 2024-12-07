import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../../service/data.service';

@Component({
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  selector: 'app-order-confirm-dialog',
  templateUrl: './order-confirm-dialog.component.html',
  styleUrls: ['./order-confirm-dialog.component.css']
})
export class OrderConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OrderConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar, private dataService: DataService
  ) {}

  confirmOrder(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = user.id;
  
    // Extract the selected product IDs from the cart items
    const selectedProductIds = this.data.cartItems.map((item: any) => item.productId);
  
    // Pass the user ID and selected product IDs to the backend
    this.dataService.confirmOrder({ user_id: userId, product_ids: selectedProductIds }).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.dialogRef.close(true);
          this.snackBar.open('Order Complete!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        } else {
          console.error('Order confirmation failed');
        }
      },
      error: (err) => {
        console.error('Error confirming order:', err.message || err);
      }
    });
  }
  
  
}