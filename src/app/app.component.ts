import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeNavigationComponent } from './home-navigation/home-navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HomeNavigationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
