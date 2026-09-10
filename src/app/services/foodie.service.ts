import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { FoodieData, Restaurant, FoodItem, FoodReview, User } from '../models/foodie.model';

@Injectable({
  providedIn: 'root'
})
export class FoodieService {
  private dataSubject = new BehaviorSubject<FoodieData | null>(null);
  private favStorageKey = 'my_favorite_foods';
  private favoritesSubject = new BehaviorSubject<number[]>(this.getStoredFavorites());
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchData();
  }

  private fetchData(): void {
    // โหลดไฟล์จาก assets/foodie.json
    this.http.get<FoodieData>('assets/foodie.json').subscribe({
      next: (data) => this.dataSubject.next(data),
      error: () => {
        // Fallback รองรับ Angular ที่ build ชี้ไปที่ root
        this.http.get<FoodieData>('/foodie.json').subscribe({
          next: (data) => this.dataSubject.next(data),
          error: (err) => console.error('Cannot load foodie.json:', err)
        });
      }
    });
  }

  getRestaurants(): Observable<Restaurant[]> {
    return this.dataSubject.asObservable().pipe(
      map(data => data ? [...data.restaurants].sort((a, b) => a.id - b.id) : [])
    );
  }

  getRestaurantById(id: number): Observable<Restaurant | undefined> {
    return this.dataSubject.asObservable().pipe(
      map(data => data?.restaurants.find(r => r.id === id))
    );
  }

  getFoodItems(): Observable<FoodItem[]> {
    return this.dataSubject.asObservable().pipe(
      map(data => data ? data.foodItems : [])
    );
  }

  getFoodItemsByRestaurant(restaurantId: number): Observable<FoodItem[]> {
    return this.dataSubject.asObservable().pipe(
      map(data => data ? data.foodItems.filter(f => f.restaurant_id === restaurantId) : [])
    );
  }

  getFoodItemById(id: number): Observable<FoodItem | undefined> {
    return this.dataSubject.asObservable().pipe(
      map(data => data?.foodItems.find(f => f.id === id))
    );
  }

  getReviewsByFoodItem(foodItemId: number): Observable<FoodReview[]> {
    return this.dataSubject.asObservable().pipe(
      map(data => data ? data.foodReviews.filter(r => r.food_item_id === foodItemId) : [])
    );
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.dataSubject.asObservable().pipe(
      map(data => data?.users.find(u => u.id === id))
    );
  }

  // ระบบ Favorite จัดเก็บใน LocalStorage ปิด Browser ข้อมูลยังคงอยู่
  private getStoredFavorites(): number[] {
    const saved = localStorage.getItem(this.favStorageKey);
    return saved ? JSON.parse(saved) : [];
  }

  toggleFavorite(foodId: number): void {
    let favs = [...this.favoritesSubject.value];
    if (favs.includes(foodId)) {
      favs = favs.filter(id => id !== foodId);
    } else {
      favs.push(foodId);
    }
    localStorage.setItem(this.favStorageKey, JSON.stringify(favs));
    this.favoritesSubject.next(favs);
  }

  removeFavorite(foodId: number): void {
    const favs = this.favoritesSubject.value.filter(id => id !== foodId);
    localStorage.setItem(this.favStorageKey, JSON.stringify(favs));
    this.favoritesSubject.next(favs);
  }

  clearFavorites(): void {
    localStorage.removeItem(this.favStorageKey);
    this.favoritesSubject.next([]);
  }

  isFavorite(foodId: number): boolean {
    return this.favoritesSubject.value.includes(foodId);
  }
}