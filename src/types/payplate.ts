export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  heroImage: string;
  logoImage?: string;
  rating: number;
  reviewCount: number;
  etaMinutes: number;
  distance: string;
  discountLabel: string;
  studentDiscountPercent: number;
  categories: string[];
  isOpen: boolean;
  openingHours: { day: string; hours: string }[];
  tags: string[];
  reviews: Review[];
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  priceCents: number;
  originalPriceCents?: number;
  image: string;
  prepTimeMinutes: number;
  calories?: number;
  dietaryTags: string[];
  isPopular: boolean;
  category: string;
  rating?: number;
  popularityCount?: number;
}

export interface Review {
  id: string;
  restaurantId: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  restaurantName: string;
  discountPercent: number;
  expiryDate: string;
  image: string;
  isStudentExclusive: boolean;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  tier: "bronze" | "silver" | "gold" | "diamond";
  pointsCost: number;
  icon: string;
  isEarned: boolean;
  progressPercent?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  target: number;
  isComplete: boolean;
  timeframe: "daily" | "weekly";
}

export interface Transaction {
  id: string;
  type: "topup" | "payment" | "reward" | "refund";
  amountCents: number;
  description: string;
  merchantName?: string;
  date: string;
}

export interface OrderItem {
  item: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  totalCents: number;
  status: "preparing" | "ready" | "picked_up" | "cancelled";
  createdAt: string;
  rewardPointsEarned: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  university?: string;
  studentNumber?: string;
  verificationStatus: "unverified" | "pending" | "verified";
}
