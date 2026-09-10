import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RestaurantDetailComponent } from './pages/restaurant-detail/restaurant-detail.component';
import { ReviewComponent } from './pages/review/review.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'restaurant/:id', component: RestaurantDetailComponent },
  { path: 'review/:foodId', component: ReviewComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '**', redirectTo: '' }
];