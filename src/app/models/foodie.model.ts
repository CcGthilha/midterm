export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Restaurant {
  id: number;
  name: string;
  restaurant_type: string;
  location: string;
}

export interface FoodItem {
  id: number;
  name: string;
  food_type: string;
  image_path: string;
  price: number;
  is_available: boolean;
  restaurant_id: number;
}

export interface FoodReview {
  id: number;
  rating: number;
  comment: string;
  user_id: number;
  food_item_id: number;
}

export interface FoodieData {
  users: User[];
  restaurants: Restaurant[];
  foodItems: FoodItem[];
  foodReviews: FoodReview[];
}