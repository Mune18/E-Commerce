import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost/Assessment/e-commerce/api/';

  constructor(private http: HttpClient, private router: Router) {}

  // AuthService Methods
  userLogin(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}userlogin`, { username, password }).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', 'Customer');
          const minimalUserData = {
            id: response.id,
            name: response.username
          };
          localStorage.setItem('currentUser', JSON.stringify(minimalUserData));
          return response;
        } else {
          return false;
        }
      }),
      catchError(this.handleError)
    );
  }

  // Registration method
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}register`, user).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Product methods
  addProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}addproduct`, formData).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Fetch products
  loadProducts(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}getproducts`, { headers }).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Shopping cart methods
  addToCart(cartData: { userId: number, productId: number, quantity: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}addtocart`, cartData).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Update Cart
  updateCart(cartData: { user_id: number, product_id: number, quantity: number }): Observable<any> {
    // console.log('Update Cart Data:', cartData); // Log the data being sent
    return this.http.post<any>(`${this.apiUrl}updatecart`, cartData).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  removeFromCart(cartData: { user_id: number, product_id: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}removefromcart`, cartData).pipe(
        map(response => response),
        catchError(this.handleError)
    );
}

confirmOrder(orderData: any): Observable<any> {
  const headers = this.createAuthHeaders();
  return this.http.post<any>(`${this.apiUrl}confirmorder`, orderData, { headers }).pipe(
    map(response => response),
    catchError(this.handleError)
  );
}

  getCart(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}getcart`, { headers }).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }



  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get the role of the logged-in user
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Logout method
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/user/login']);
  }

  // Create authorization headers
  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Error Handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('Error:', errorMessage); // Log the complete error
    return throwError(() => new Error(errorMessage));
  }
}
