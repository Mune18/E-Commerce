import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { UserRegisterComponent } from '../userregister/userregister.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css'],
  standalone: true,
  imports: [FormsModule, UserRegisterComponent, RouterModule, CommonModule, MatSnackBarModule]
})
export class UserLoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private dataService: DataService, 
    private router: Router, 
    private snackBar: MatSnackBar
  ) {}
  onSubmit() {
    this.dataService.userLogin(this.username, this.password).subscribe(
      response => {
        if (response && response.token) {
          // Store the token in localStorage
          localStorage.setItem('token', response.token);
          
          // Navigate to the UserHomeComponent
          this.router.navigate(['/userhome']).then(() => {
            console.log('Navigation to UserHomeComponent successful');
            // Show success snackbar
            this.snackBar.open('Successfully logged in', 'Close', {
              duration: 3000, // Duration in milliseconds
            });
          });
        } else {
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', {
            duration: 3000,
          });
        }
      },
      error => {
        // Handle HTTP error
        console.error('Login error:', error);
        this.snackBar.open('Login failed. Please try again later.', 'Close', {
          duration: 3000,
        });
      }
    );
  }
}

