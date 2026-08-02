export type UserRole = "student" | "staff" | "admin";

export type VerificationStatus = "unverified" | "pending" | "verified";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  university?: string;
  studentNumber?: string;
  faculty?: string;
  campus?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

export type DietaryTag = "Vegan" | "Vegetarian" | "Halal" | "Kosher" | "Gluten-Free" | "Spicy";

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  prepTimeMinutes: number;
  calories?: number;
  dietaryTags: DietaryTag[];
  isPopular?: boolean;
  category: string;
  rating?: number;
  popularityCount?: number;
}

export interface Review {
  id: string;
  restaurantId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

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
  studentDiscountPercent?: number;
  categories: string[];
  isOpen: boolean;
  openingHours: { day: string; hours: string }[];
  reviews: Review[];
  menuItems: MenuItem[];
  tags?: string[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";
export type OrderType = "delivery" | "pickup";
export type PaymentMethod = "wallet" | "card";

export interface Order {
  id: string;
  items: CartItem[];
  subtotalCents: number;
  studentDiscountCents: number;
  promoDiscountCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  status: OrderStatus;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  restaurantId: string;
  restaurantName: string;
  createdAt: string;
  estimatedReadyAt: string;
}

export type TransactionType = "topup" | "payment" | "refund" | "reward";

export interface Transaction {
  id: string;
  type: TransactionType;
  amountCents: number;
  description: string;
  date: string;
  merchantName?: string;
}

export type RewardTier = "bronze" | "silver" | "gold" | "diamond";

export interface Reward {
  id: string;
  title: string;
  description: string;
  tier: RewardTier;
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

export interface WalletState {
  balanceCents: number;
  transactions: Transaction[];
  totalSpentThisMonthCents: number;
  rewardPoints: number;
  tier: RewardTier;
  tierProgressPercent: number;
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
