import { restaurants, allMenuItems, offers, rewards, challenges, mockTransactions } from "./payplate-data";
import type {
  Restaurant,
  MenuItem,
  Offer,
  Reward,
  Challenge,
  Transaction,
} from "@/types/payplate";

/**
 * Service layer for restaurant and menu data.
 * Currently returns mock data, but is structured so that
 * swapping to a real API or Supabase only changes the internals.
 */

const ARTIFICIAL_DELAY = 400;

function delay<T>(data: T, ms = ARTIFICIAL_DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    return delay(restaurants);
  },

  async getById(id: string): Promise<Restaurant | null> {
    return delay(restaurants.find((r) => r.id === id) ?? null);
  },

  async getOpenNow(): Promise<Restaurant[]> {
    return delay(restaurants.filter((r) => r.isOpen));
  },

  async getByCategory(category: string): Promise<Restaurant[]> {
    return delay(restaurants.filter((r) => r.categories.some((c) => c.toLowerCase() === category.toLowerCase())));
  },

  async search(query: string): Promise<Restaurant[]> {
    const q = query.toLowerCase().trim();
    if (!q) return delay(restaurants);
    return delay(
      restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.categories.some((c) => c.toLowerCase().includes(q)),
      ),
    );
  },
};

export const menuService = {
  async getByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return delay(allMenuItems.filter((m) => m.restaurantId === restaurantId));
  },

  async getPopular(): Promise<MenuItem[]> {
    return delay(allMenuItems.filter((m) => m.isPopular));
  },

  async search(query: string): Promise<MenuItem[]> {
    const q = query.toLowerCase().trim();
    if (!q) return delay(allMenuItems);
    return delay(
      allMenuItems.filter(
        (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q),
      ),
    );
  },
};

export const offerService = {
  async getAll(): Promise<Offer[]> {
    return delay(offers);
  },

  async getStudentExclusive(): Promise<Offer[]> {
    return delay(offers.filter((o) => o.isStudentExclusive));
  },
};

export const rewardService = {
  async getAll(): Promise<Reward[]> {
    return delay(rewards);
  },

  async getChallenges(): Promise<Challenge[]> {
    return delay(challenges);
  },
};

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    return delay(mockTransactions);
  },
};
