import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../service/data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin-add-product-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './admin-add-product-dialog.component.html',
  styleUrls: ['./admin-add-product-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminAddProductDialogComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    public dialogRef: MatDialogRef<AdminAddProductDialogComponent>
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required]  // Added category field
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.productForm.valid && this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('category', this.productForm.get('category')?.value); // Append category
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.dataService.addProduct(formData).subscribe(
        response => {
          console.log('Product added successfully:', response);
          this.dialogRef.close();
        },
        error => {
          console.error('Error adding product:', error);
        }
      );
    } else {
      console.log('Form is invalid or image not selected');
    }
  }
}
