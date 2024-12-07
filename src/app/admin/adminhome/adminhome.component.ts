import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { AdminAddProductDialogComponent } from './admin-add-product-dialog/admin-add-product-dialog.component';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-adminhome',
  standalone: true,
  imports: [CommonModule, MatCommonModule],
  templateUrl: './adminhome.component.html',
  styleUrl: './adminhome.component.css'
})
export class AdminhomeComponent {
  products: any[] = [];  // Array to hold products

  constructor(private dialog: MatDialog, private dataService: DataService) {}

  openAddProductDialog() {
    const dialogRef = this.dialog.open(AdminAddProductDialogComponent);

  }

}
