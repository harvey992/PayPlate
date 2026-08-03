/*
# PayPlate Core Schema — Phase 1

## Overview
Creates the foundational database tables for the PayPlate student food & wallet ecosystem.

## New Tables
1. **profiles** — extends auth.users with student-specific fields (full name, university, student number, verification status, reward tier)
2. **restaurants** — campus restaurants with hero images, ratings, opening hours, student discounts
3. **menu_items** — food items belonging to restaurants, with categories, prices, dietary tags
4. **orders** — student food orders with status tracking, payment method, delivery/pickup type
5. **order_items** — line items for each order (quantity, price snapshot)
6. **transactions** — wallet transactions (top-ups, payments, refunds, rewards)
7. **rewards** — redeemable rewards with tier requirements and point costs

## Security (RLS)
- **profiles**: users can read/update only their own profile
- **restaurants**: public read (all authenticated users can browse restaurants)
- **menu_items**: public read
- **orders**: users can read/insert only their own orders
- **order_items**: users can read items for their own orders (via parent order ownership)
- **transactions**: users can read/insert only their own transactions
- **rewards**: public read (all authenticated users can see available rewards)

## Important Notes
1. profiles.id references auth.users(id) with ON DELETE CASCADE — when a user is deleted, their profile is automatically removed
2. profiles.user_id defaults to auth.uid() so inserts from authenticated clients work without explicitly passing user_id
3. orders.user_id defaults to auth.uid() for the same reason
4. All amount columns use integer cents (e.g. 7200 = R72.00) to avoid floating-point issues
5. order_items.price_cents snapshots the price at order time — if menu item prices change later, historical orders remain accurate
*/

-- === 1. profiles ===
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  avatar_url text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'staff', 'admin')),
  verification_status text NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  university text,
  student_number text,
  faculty text,
  campus text,
  reward_tier text NOT NULL DEFAULT 'bronze' CHECK (reward_tier IN ('bronze', 'silver', 'gold', 'diamond')),
  reward_points integer NOT NULL DEFAULT 0,
  wallet_balance_cents integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- === 2. restaurants ===
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cuisine text NOT NULL,
  hero_image text NOT NULL,
  logo_image text,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  eta_minutes integer NOT NULL DEFAULT 15,
  distance text NOT NULL DEFAULT '',
  discount_label text NOT NULL DEFAULT '',
  student_discount_percent integer NOT NULL DEFAULT 0,
  categories text[] NOT NULL DEFAULT '{}',
  is_open boolean NOT NULL DEFAULT true,
  opening_hours jsonb NOT NULL DEFAULT '[]',
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_restaurants" ON restaurants;
CREATE POLICY "read_restaurants" ON restaurants FOR SELECT
  TO authenticated USING (true);

-- === 3. menu_items ===
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price_cents integer NOT NULL,
  image text NOT NULL,
  prep_time_minutes integer NOT NULL DEFAULT 10,
  calories integer,
  dietary_tags text[] NOT NULL DEFAULT '{}',
  is_popular boolean NOT NULL DEFAULT false,
  category text NOT NULL,
  rating numeric(2,1),
  popularity_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_menu_items" ON menu_items;
CREATE POLICY "read_menu_items" ON menu_items FOR SELECT
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);

-- === 4. orders ===
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id),
  restaurant_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
  order_type text NOT NULL DEFAULT 'delivery' CHECK (order_type IN ('delivery', 'pickup')),
  payment_method text NOT NULL DEFAULT 'wallet' CHECK (payment_method IN ('wallet', 'card')),
  subtotal_cents integer NOT NULL,
  student_discount_cents integer NOT NULL DEFAULT 0,
  promo_discount_cents integer NOT NULL DEFAULT 0,
  delivery_fee_cents integer NOT NULL DEFAULT 0,
  total_cents integer NOT NULL,
  estimated_ready_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- === 5. order_items ===
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id),
  name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_cents integer NOT NULL,
  image text
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- === 6. transactions ===
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('topup', 'payment', 'refund', 'reward')),
  amount_cents integer NOT NULL,
  description text NOT NULL,
  merchant_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_transactions" ON transactions;
CREATE POLICY "select_own_transactions" ON transactions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_transactions" ON transactions;
CREATE POLICY "insert_own_transactions" ON transactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);

-- === 7. rewards ===
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'diamond')),
  points_cost integer NOT NULL,
  icon text NOT NULL DEFAULT 'gift',
  is_earned boolean NOT NULL DEFAULT false,
  progress_percent integer NOT NULL DEFAULT 0
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_rewards" ON rewards;
CREATE POLICY "read_rewards" ON rewards FOR SELECT
  TO authenticated USING (true);

-- === Updated_at trigger ===
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
