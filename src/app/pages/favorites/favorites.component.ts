import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FoodieService } from '../../services/foodie.service';
import { FoodItem, Restaurant } from '../../models/foodie.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html', // ปรับเป็น favorites.html ถ้าใช้ชื่อสั้น
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteFoods: FoodItem[] = [];
  restaurants: Restaurant[] = [];

  constructor(private foodieService: FoodieService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.foodieService.getRestaurants().subscribe(rests => {
      this.restaurants = rests;
      this.refreshFavorites();
    });

    this.foodieService.favorites$.subscribe(() => {
      this.refreshFavorites();
    });
  }

  refreshFavorites(): void {
    this.foodieService.getFoodItems().subscribe(foods => {
      this.foodieService.favorites$.subscribe(favIds => {
        this.favoriteFoods = foods.filter(f => favIds.includes(f.id));
        this.cdr.markForCheck();
      });
    });
  }

  getRestaurantName(restaurantId: number): string {
    const res = this.restaurants.find(r => r.id === restaurantId);
    return res ? res.name : '-';
  }

  removeFav(foodId: number): void {
    this.foodieService.removeFavorite(foodId);
  }

  clearAll(): void {
    if (confirm('คุณต้องการล้างรายการอาหารที่ชอบทั้งหมดใช่หรือไม่?')) {
      this.foodieService.clearFavorites();
    }
  }
}