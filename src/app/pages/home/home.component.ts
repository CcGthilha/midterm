import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FoodieService } from '../../services/foodie.service';
import { Restaurant, FoodItem } from '../../models/foodie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html', // ถ้าไฟล์ชื่อ home.html ให้แก้เป็น './home.html'
  styleUrls: ['./home.component.css']  // ถ้าไฟล์ชื่อ home.css ให้แก้เป็น './home.css'
})
export class HomeComponent implements OnInit {
  restaurants: Restaurant[] = [];
  foodItems: FoodItem[] = [];

  searchRestaurant: string = '';
  selectedType: string = '';
  searchMenu: string = '';

  constructor(private foodieService: FoodieService) {}

  ngOnInit(): void {
    this.foodieService.getRestaurants().subscribe(res => this.restaurants = res);
    this.foodieService.getFoodItems().subscribe(foods => this.foodItems = foods);
  }

  get restaurantTypes(): string[] {
    return Array.from(new Set(this.restaurants.map(r => r.restaurant_type)));
  }

  get filteredRestaurants(): Restaurant[] {
    return this.restaurants.filter(res => {
      const matchName = res.name.toLowerCase().includes(this.searchRestaurant.toLowerCase());
      const matchType = this.selectedType ? res.restaurant_type === this.selectedType : true;

      let matchMenu = true;
      if (this.searchMenu.trim()) {
        const matchingFoodIds = this.foodItems
          .filter(f => f.name.toLowerCase().includes(this.searchMenu.toLowerCase()))
          .map(f => f.restaurant_id);
        matchMenu = matchingFoodIds.includes(res.id);
      }

      return matchName && matchType && matchMenu;
    });
  }
}