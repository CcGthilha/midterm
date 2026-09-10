import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FoodieService } from '../../services/foodie.service';
import { Restaurant, FoodItem } from '../../models/foodie.model';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurant-detail.component.html', // ถ้าเป็น restaurant-detail.html ให้แก้ตามไฟล์จริง
  styleUrls: ['./restaurant-detail.component.css']
})
export class RestaurantDetailComponent implements OnInit {
  restaurant?: Restaurant;
  foodItems: FoodItem[] = [];
  favoriteIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private foodieService: FoodieService
  ) {}

  ngOnInit(): void {
    const restaurantId = Number(this.route.snapshot.paramMap.get('id'));
    this.foodieService.getRestaurantById(restaurantId).subscribe(r => this.restaurant = r);
    this.foodieService.getFoodItemsByRestaurant(restaurantId).subscribe(f => this.foodItems = f);
    this.foodieService.favorites$.subscribe(favs => this.favoriteIds = favs);
  }

  toggleFav(foodId: number): void {
    this.foodieService.toggleFavorite(foodId);
  }

  isFav(foodId: number): boolean {
    return this.favoriteIds.includes(foodId);
  }
}