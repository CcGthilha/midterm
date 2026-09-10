import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FoodieService } from '../../services/foodie.service';
import { FoodItem, FoodReview } from '../../models/foodie.model';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './review.component.html', // ปรับเป็น review.html ถ้าใช้ชื่อสั้น
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  foodItem?: FoodItem;
  reviews: FoodReview[] = [];
  usersMap = new Map<number, string>();
  prevRestId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private foodieService: FoodieService
  ) {}

  ngOnInit(): void {
    const foodId = Number(this.route.snapshot.paramMap.get('foodId'));
    this.prevRestId = Number(this.route.snapshot.queryParamMap.get('restId')) || null;

    this.foodieService.getFoodItemById(foodId).subscribe(food => {
      this.foodItem = food;
      if (!this.prevRestId && food) {
        this.prevRestId = food.restaurant_id;
      }
    });

    this.foodieService.getReviewsByFoodItem(foodId).subscribe(revs => {
      this.reviews = revs;
      revs.forEach(r => {
        this.foodieService.getUserById(r.user_id).subscribe(user => {
          if (user) {
            this.usersMap.set(r.user_id, user.name);
          }
        });
      });
    });
  }

  getUserName(userId: number): string {
    return this.usersMap.get(userId) || `User ID: ${userId}`;
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}