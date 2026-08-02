import type {
  MenuItem,
  Offer,
  Restaurant,
  Reward,
  Challenge,
  Transaction,
} from "@/types/payplate";

export function formatRand(cents: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatRandShort(cents: number): string {
  const rands = cents / 100;
  if (rands >= 1000) return `R${(rands / 1000).toFixed(1)}k`;
  return `R${rands.toFixed(0)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-ZA", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const px = (url: string, w = 600, h = 600) => {
  const base = url.split("?auto=")[0];
  return `${base}?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;
};

// Real Pexels food photography URLs
const IMG = {
  burgerHero: "https://images.pexels.com/photos/4253703/pexels-photo-4253703.jpeg",
  burgerItem: "https://images.pexels.com/photos/16241419/pexels-photo-16241419.jpeg",
  veganBurger: "https://images.pexels.com/photos/23106708/pexels-photo-23106708.jpeg",
  fries: "https://images.pexels.com/photos/18867543/pexels-photo-18867543.jpeg",
  shake: "https://images.pexels.com/photos/14701529/pexels-photo-14701529.jpeg",
  pizzaHero: "https://images.pexels.com/photos/6223172/pexels-photo-6223172.jpeg",
  pizzaMargherita: "https://images.pexels.com/photos/2762939/pexels-photo-2762939.jpeg",
  pizzaPepperoni: "https://images.pexels.com/photos/30504705/pexels-photo-30504705.jpeg",
  pizzaSlice: "https://images.pexels.com/photos/11400977/pexels-photo-11400977.jpeg",
  greenhouseHero: "https://images.pexels.com/photos/13630358/pexels-photo-13630358.jpeg",
  harvestBowl: "https://images.pexels.com/photos/7146785/pexels-photo-7146785.jpeg",
  smoothie: "https://images.pexels.com/photos/1346342/pexels-photo-1346342.jpeg",
  brewHero: "https://images.pexels.com/photos/17670119/pexels-photo-17670119.jpeg",
  coffee: "https://images.pexels.com/photos/38028987/pexels-photo-38028987.jpeg",
  croissant: "https://images.pexels.com/photos/38028984/pexels-photo-38028984.jpeg",
  sushiHero: "https://images.pexels.com/photos/2291347/pexels-photo-2291347.jpeg",
  sushiRoll: "https://images.pexels.com/photos/4871111/pexels-photo-4871111.jpeg",
  noodleHero: "https://images.pexels.com/photos/772518/pexels-photo-772518.png",
  ramen: "https://images.pexels.com/photos/8743923/pexels-photo-8743923.jpeg",
};

const menuBurger: MenuItem = {
  id: "classic-cheeseburger",
  restaurantId: "burger-lab",
  name: "Classic Cheeseburger",
  description: "Beef patty, melted cheddar, lettuce, tomato, house sauce on a brioche bun.",
  priceCents: 7200,
  image: px(IMG.burgerItem),
  prepTimeMinutes: 12,
  calories: 650,
  dietaryTags: [],
  isPopular: true,
  category: "Burgers",
  rating: 4.8,
  popularityCount: 1240,
};

const menuVeganBurger: MenuItem = {
  id: "plant-power-burger",
  restaurantId: "burger-lab",
  name: "Plant Power Burger",
  description: "Beyond patty, vegan cheese, rocket, caramelised onion, vegan mayo.",
  priceCents: 8400,
  image: px(IMG.veganBurger),
  prepTimeMinutes: 14,
  calories: 480,
  dietaryTags: ["Vegan", "Halal"],
  isPopular: true,
  category: "Burgers",
  rating: 4.6,
  popularityCount: 890,
};

const menuFries: MenuItem = {
  id: "truffle-fries",
  restaurantId: "burger-lab",
  name: "Truffle Parmesan Fries",
  description: "Hand-cut fries tossed in truffle oil and parmesan.",
  priceCents: 3800,
  image: px(IMG.fries),
  prepTimeMinutes: 8,
  calories: 420,
  dietaryTags: ["Vegetarian"],
  isPopular: false,
  category: "Sides",
  rating: 4.7,
  popularityCount: 2100,
};

const menuShake: MenuItem = {
  id: "chocolate-shake",
  restaurantId: "burger-lab",
  name: "Belgian Chocolate Shake",
  description: "Thick chocolate shake with whipped cream and dark cocoa shards.",
  priceCents: 4500,
  image: px(IMG.shake),
  prepTimeMinutes: 5,
  calories: 520,
  dietaryTags: ["Vegetarian"],
  isPopular: true,
  category: "Drinks",
  rating: 4.9,
  popularityCount: 1800,
};

const menuPizzaMargherita: MenuItem = {
  id: "margherita-pizza",
  restaurantId: "pizza-studio",
  name: "Margherita Pizza",
  description: "San Marzano tomato, fresh mozzarella, basil, extra virgin olive oil.",
  priceCents: 9500,
  image: px(IMG.pizzaMargherita),
  prepTimeMinutes: 18,
  calories: 850,
  dietaryTags: ["Vegetarian"],
  isPopular: true,
  category: "Pizzas",
  rating: 4.8,
  popularityCount: 1560,
};

const menuPizzaPepperoni: MenuItem = {
  id: "pepperoni-pizza",
  restaurantId: "pizza-studio",
  name: "Pepperoni Pizza",
  description: "Double pepperoni, mozzarella, tomato base, chili oil drizzle.",
  priceCents: 10800,
  image: px(IMG.pizzaPepperoni),
  prepTimeMinutes: 18,
  calories: 980,
  dietaryTags: ["Spicy"],
  isPopular: true,
  category: "Pizzas",
  rating: 4.7,
  popularityCount: 1320,
};

const menuBowlHarvest: MenuItem = {
  id: "harvest-bowl",
  restaurantId: "greenhouse-deli",
  name: "Harvest Bowl",
  description: "Quinoa, roasted sweet potato, chickpeas, kale, tahini dressing.",
  priceCents: 8600,
  image: px(IMG.harvestBowl),
  prepTimeMinutes: 10,
  calories: 540,
  dietaryTags: ["Vegan", "Gluten-Free"],
  isPopular: true,
  category: "Bowls",
  rating: 4.9,
  popularityCount: 980,
};

const menuSmoothie: MenuItem = {
  id: "green-glow-smoothie",
  restaurantId: "greenhouse-deli",
  name: "Green Glow Smoothie",
  description: "Spinach, banana, mango, ginger, flax seed, almond milk.",
  priceCents: 4200,
  image: px(IMG.smoothie),
  prepTimeMinutes: 5,
  calories: 280,
  dietaryTags: ["Vegan", "Gluten-Free"],
  isPopular: true,
  category: "Smoothies",
  rating: 4.7,
  popularityCount: 750,
};

const menuCoffee: MenuItem = {
  id: "flat-white",
  restaurantId: "brew-lab",
  name: "Flat White",
  description: "Double ristretto, velvety steamed milk, micro-foam.",
  priceCents: 2800,
  image: px(IMG.coffee),
  prepTimeMinutes: 4,
  calories: 120,
  dietaryTags: ["Vegetarian"],
  isPopular: true,
  category: "Coffee",
  rating: 4.8,
  popularityCount: 3200,
};

const menuCroissant: MenuItem = {
  id: "butter-croissant",
  restaurantId: "brew-lab",
  name: "Butter Croissant",
  description: "Flaky, buttery, baked fresh daily. Best paired with a flat white.",
  priceCents: 2500,
  image: px(IMG.croissant),
  prepTimeMinutes: 3,
  calories: 270,
  dietaryTags: ["Vegetarian"],
  isPopular: false,
  category: "Pastries",
  rating: 4.6,
  popularityCount: 1100,
};

const menuSushiRoll: MenuItem = {
  id: "dragon-roll",
  restaurantId: "sushi-sensei",
  name: "Dragon Roll",
  description: "Eel, cucumber, avocado on top, tobiko, eel sauce drizzle.",
  priceCents: 11200,
  image: px(IMG.sushiRoll),
  prepTimeMinutes: 15,
  calories: 480,
  dietaryTags: [],
  isPopular: true,
  category: "Sushi",
  rating: 4.9,
  popularityCount: 670,
};

const menuRamen: MenuItem = {
  id: "tonkotsu-ramen",
  restaurantId: "noodle-house",
  name: "Tonkotsu Ramen",
  description: "Rich pork bone broth, chashu, soft egg, green onion, nori.",
  priceCents: 9800,
  image: px(IMG.ramen),
  prepTimeMinutes: 20,
  calories: 720,
  dietaryTags: ["Spicy"],
  isPopular: true,
  category: "Ramen",
  rating: 4.8,
  popularityCount: 890,
};

export const restaurants: Restaurant[] = [
  {
    id: "burger-lab",
    name: "Burger Lab",
    cuisine: "Burgers · Shakes",
    heroImage: px(IMG.burgerHero, 800, 500),
    logoImage: px(IMG.burgerItem, 100, 100),
    rating: 4.8,
    reviewCount: 320,
    etaMinutes: 18,
    distance: "0.4 km",
    discountLabel: "15% Student",
    studentDiscountPercent: 15,
    categories: ["Burgers", "Sides", "Drinks"],
    isOpen: true,
    openingHours: [
      { day: "Mon–Fri", hours: "09:00 – 22:00" },
      { day: "Sat–Sun", hours: "10:00 – 23:00" },
    ],
    tags: ["Popular", "Student Deal"],
    reviews: [
      { id: "r1", restaurantId: "burger-lab", authorName: "Thabo M.", rating: 5, comment: "Best burger on campus, no cap.", date: "2026-07-28T14:30:00Z" },
      { id: "r2", restaurantId: "burger-lab", authorName: "Sara K.", rating: 4, comment: "Plant burger is genuinely amazing.", date: "2026-07-26T12:00:00Z" },
      { id: "r3", restaurantId: "burger-lab", authorName: "Lwazi N.", rating: 5, comment: "Truffle fries are addictive.", date: "2026-07-25T18:45:00Z" },
    ],
    menuItems: [menuBurger, menuVeganBurger, menuFries, menuShake],
  },
  {
    id: "pizza-studio",
    name: "Pizza Studio",
    cuisine: "Pizza · Italian",
    heroImage: px(IMG.pizzaHero, 800, 500),
    rating: 4.7,
    reviewCount: 210,
    etaMinutes: 22,
    distance: "0.7 km",
    discountLabel: "20% Student",
    studentDiscountPercent: 20,
    categories: ["Pizzas"],
    isOpen: true,
    openingHours: [
      { day: "Mon–Thu", hours: "11:00 – 21:00" },
      { day: "Fri–Sun", hours: "11:00 – 23:00" },
    ],
    tags: ["Student Deal"],
    reviews: [
      { id: "r4", restaurantId: "pizza-studio", authorName: "Aisha P.", rating: 5, comment: "Margherita is perfection.", date: "2026-07-27T19:00:00Z" },
      { id: "r5", restaurantId: "pizza-studio", authorName: "Daniel R.", rating: 4, comment: "Great student discount.", date: "2026-07-24T17:15:00Z" },
    ],
    menuItems: [menuPizzaMargherita, menuPizzaPepperoni],
  },
  {
    id: "greenhouse-deli",
    name: "Greenhouse Deli",
    cuisine: "Bowls · Smoothies",
    heroImage: px(IMG.greenhouseHero, 800, 500),
    rating: 4.9,
    reviewCount: 180,
    etaMinutes: 12,
    distance: "0.2 km",
    discountLabel: "10% Student",
    studentDiscountPercent: 10,
    categories: ["Bowls", "Smoothies"],
    isOpen: true,
    openingHours: [
      { day: "Mon–Fri", hours: "07:00 – 18:00" },
      { day: "Sat–Sun", hours: "08:00 – 16:00" },
    ],
    tags: ["Healthy", "Popular"],
    reviews: [
      { id: "r6", restaurantId: "greenhouse-deli", authorName: "Naledi O.", rating: 5, comment: "Harvest bowl changed my life.", date: "2026-07-29T08:20:00Z" },
      { id: "r7", restaurantId: "greenhouse-deli", authorName: "Jordan T.", rating: 5, comment: "Best smoothies on campus.", date: "2026-07-28T10:00:00Z" },
    ],
    menuItems: [menuBowlHarvest, menuSmoothie],
  },
  {
    id: "brew-lab",
    name: "Brew Lab Coffee",
    cuisine: "Coffee · Pastries",
    heroImage: px(IMG.brewHero, 800, 500),
    rating: 4.8,
    reviewCount: 410,
    etaMinutes: 8,
    distance: "0.1 km",
    discountLabel: "Free Upgrade",
    studentDiscountPercent: 0,
    categories: ["Coffee", "Pastries"],
    isOpen: true,
    openingHours: [
      { day: "Mon–Fri", hours: "06:30 – 19:00" },
      { day: "Sat–Sun", hours: "07:30 – 17:00" },
    ],
    tags: ["Popular", "Quick"],
    reviews: [
      { id: "r8", restaurantId: "brew-lab", authorName: "Megan V.", rating: 5, comment: "Flat white is the best in town.", date: "2026-07-29T07:00:00Z" },
      { id: "r9", restaurantId: "brew-lab", authorName: "Karabo L.", rating: 5, comment: "Croissants sell out fast—go early.", date: "2026-07-28T06:45:00Z" },
    ],
    menuItems: [menuCoffee, menuCroissant],
  },
  {
    id: "sushi-sensei",
    name: "Sushi Sensei",
    cuisine: "Sushi · Japanese",
    heroImage: px(IMG.sushiHero, 800, 500),
    rating: 4.9,
    reviewCount: 150,
    etaMinutes: 25,
    distance: "1.1 km",
    discountLabel: "15% Student",
    studentDiscountPercent: 15,
    categories: ["Sushi"],
    isOpen: false,
    openingHours: [
      { day: "Mon–Sun", hours: "12:00 – 21:00" },
    ],
    tags: ["Premium"],
    reviews: [
      { id: "r10", restaurantId: "sushi-sensei", authorName: "Priya S.", rating: 5, comment: "Dragon roll is a work of art.", date: "2026-07-27T19:30:00Z" },
    ],
    menuItems: [menuSushiRoll],
  },
  {
    id: "noodle-house",
    name: "Noodle House",
    cuisine: "Ramen · Asian",
    heroImage: px(IMG.noodleHero, 800, 500),
    rating: 4.7,
    reviewCount: 260,
    etaMinutes: 20,
    distance: "0.5 km",
    discountLabel: "12% Student",
    studentDiscountPercent: 12,
    categories: ["Ramen"],
    isOpen: true,
    openingHours: [
      { day: "Mon–Sun", hours: "11:00 – 22:00" },
    ],
    tags: ["Popular"],
    reviews: [
      { id: "r11", restaurantId: "noodle-house", authorName: "Tshego M.", rating: 5, comment: "Tonkotsu broth is incredibly rich.", date: "2026-07-26T13:00:00Z" },
      { id: "r12", restaurantId: "noodle-house", authorName: "Emma W.", rating: 4, comment: "Worth the wait.", date: "2026-07-25T18:20:00Z" },
    ],
    menuItems: [menuRamen],
  },
];

export const allMenuItems: MenuItem[] = restaurants.flatMap((r) => r.menuItems);

export const offers: Offer[] = [
  {
    id: "offer-1",
    title: "Free coffee with any breakfast",
    description: "Order before 9 AM and get a free flat white.",
    restaurantName: "Brew Lab Coffee",
    discountPercent: 100,
    expiryDate: "2026-08-15",
    image: px(IMG.brewHero, 400, 250),
    isStudentExclusive: true,
  },
  {
    id: "offer-2",
    title: "20% off all pizzas",
    description: "Student-only discount on all pizzas every Thursday.",
    restaurantName: "Pizza Studio",
    discountPercent: 20,
    expiryDate: "2026-08-31",
    image: px(IMG.pizzaHero, 400, 250),
    isStudentExclusive: true,
  },
  {
    id: "offer-3",
    title: "Buy one get one free smoothie",
    description: "Valid on all smoothies during exam season.",
    restaurantName: "Greenhouse Deli",
    discountPercent: 50,
    expiryDate: "2026-08-10",
    image: px(IMG.greenhouseHero, 400, 250),
    isStudentExclusive: true,
  },
];

export const rewards: Reward[] = [
  { id: "rew-1", title: "Free Coffee", description: "Any size flat white or cappuccino.", tier: "bronze", pointsCost: 100, icon: "coffee", isEarned: true },
  { id: "rew-2", title: "Free Fries", description: "Large fries from Burger Lab.", tier: "bronze", pointsCost: 150, icon: "fries", isEarned: true },
  { id: "rew-3", title: "R50 Wallet Credit", description: "R50 loaded into your PayPlate wallet.", tier: "silver", pointsCost: 500, icon: "credit", isEarned: false, progressPercent: 72 },
  { id: "rew-4", title: "Free Pizza", description: "Any large pizza from Pizza Studio.", tier: "gold", pointsCost: 800, icon: "pizza", isEarned: false, progressPercent: 45 },
  { id: "rew-5", title: "R200 Wallet Credit", description: "R200 loaded into your PayPlate wallet.", tier: "diamond", pointsCost: 2000, icon: "diamond", isEarned: false, progressPercent: 18 },
];

export const challenges: Challenge[] = [
  { id: "ch-1", title: "Order 2 meals today", description: "Order any 2 meals in a single day.", points: 50, progress: 1, target: 2, isComplete: false, timeframe: "daily" },
  { id: "ch-2", title: "Try a new restaurant", description: "Order from a restaurant you've never tried.", points: 30, progress: 0, target: 1, isComplete: false, timeframe: "daily" },
  { id: "ch-3", title: "Spend R150 this week", description: "Total spending across all orders.", points: 100, progress: 8600, target: 15000, isComplete: false, timeframe: "weekly" },
  { id: "ch-4", title: "Order 5 times this week", description: "Complete 5 separate orders.", points: 80, progress: 2, target: 5, isComplete: false, timeframe: "weekly" },
];

export const mockTransactions: Transaction[] = [
  { id: "t1", type: "topup", amountCents: 50000, description: "Wallet top-up", date: "2026-07-29T09:00:00Z" },
  { id: "t2", type: "payment", amountCents: -7200, description: "Burger Lab — Classic Cheeseburger", merchantName: "Burger Lab", date: "2026-07-28T14:30:00Z" },
  { id: "t3", type: "payment", amountCents: -2800, description: "Brew Lab — Flat White", merchantName: "Brew Lab Coffee", date: "2026-07-28T08:00:00Z" },
  { id: "t4", type: "reward", amountCents: 500, description: "Cashback reward", date: "2026-07-27T20:00:00Z" },
  { id: "t5", type: "payment", amountCents: -8600, description: "Greenhouse Deli — Harvest Bowl", merchantName: "Greenhouse Deli", date: "2026-07-27T12:15:00Z" },
  { id: "t6", type: "refund", amountCents: 4500, description: "Refund — cancelled order", date: "2026-07-26T16:00:00Z" },
  { id: "t7", type: "topup", amountCents: 20000, description: "Wallet top-up", date: "2026-07-25T10:00:00Z" },
  { id: "t8", type: "payment", amountCents: -9500, description: "Pizza Studio — Margherita Pizza", merchantName: "Pizza Studio", date: "2026-07-24T19:00:00Z" },
];

export const recentlyOrderedItemIds = ["classic-cheeseburger", "flat-white", "harvest-bowl", "margherita-pizza"];
