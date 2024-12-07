import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home-navigation/home/home.component';
import { UserAuthGuard } from './service/login/userauth.guard';
import { UserLoginComponent } from './user/userlogin/userlogin.component';
import { UserRegisterComponent } from './user/userregister/userregister.component';
import { UserhomeComponent } from './user/userhome/userhome.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AdminhomeComponent } from './admin/adminhome/adminhome.component';
import { CartComponent } from './user/cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: UserLoginComponent,
  },
  {
    path: 'register',
    component: UserRegisterComponent,
  },
  {
    path: 'userhome',
    component: UserhomeComponent,
  },
  {
    path: 'usercart',
    component: CartComponent, // Add this route
  },
  {
    path: 'admin/home',
    component: AdminhomeComponent,
  },
  {
    path: '**',
    redirectTo: '/home',
  },
]

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppComponent,
    UserLoginComponent,
    UserRegisterComponent,
    HomeComponent,
    UserhomeComponent,
    
  ],
  providers: [],
})
export class AppModule { }
