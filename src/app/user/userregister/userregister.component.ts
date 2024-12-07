import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../service/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-userregister',
  templateUrl: './userregister.component.html',
  styleUrls: ['./userregister.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class UserRegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  retypePassword: string = '';

  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onSubmit() {
    if (this.password !== this.retypePassword) {
      alert('Passwords do not match.');
      return;
    }

    const user = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.dataService.register(user).subscribe(
      (response) => {
        // Show snackbar on successful registration
        this.snackBar.open('Account created successfully!', 'Close', {
          duration: 3000, // Duration in milliseconds
          verticalPosition: 'top', // Snackbar position
          horizontalPosition: 'center' // Snackbar position
        });

        // Navigate to login page after showing snackbar
        this.router.navigate(['/login']);
      },
      (error) => {
        // Handle registration error
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    );
  }

}

