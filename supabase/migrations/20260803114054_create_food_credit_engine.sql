/*
# Food Credit Engine — Credit Accounts, Scores, Repayments, Events

## Overview
Creates the core credit engine tables that let PayPlate users "Eat Now, Pay Later" with
approved food credit. Users receive a credit limit, spend against it at restaurants,
and repay over time with interest. A credit scoring system automatically adjusts limits
based on repayment behaviour, order frequency, and verification status.

## New Tables
1. **credit_accounts** — one per user; holds credit limit, used amount, interest rate,
   monthly due date, credit status (active/frozen/suspended), and emergency credit.
2. **credit_scores** — historical credit score records (0–1000) with tier
   (bronze/silver/gold/diamond/platinum), computed from repayment history, order
   frequency, missed payments, wallet activity, and risk score.
3. **repayments** — individual repayment records against the credit account; supports
   full, partial, scheduled, and auto-debit payments with status tracking.
4. **credit_events** — audit log of every credit lifecycle event (limit increase,
   freeze, late fee, repayment reminder, etc.) for transparency and fraud detection.

## Security (RLS)
- All four tables are owner-scoped: users can only read/write their own data.
- credit_events are read-only from the client (server inserts via edge functions).
- All policies use auth.uid() ownership checks.

## Important Notes
1. credit_accounts.user_id defaults to auth.uid() so account creation works without
   explicitly passing user_id from the client.
2. All monetary values are in integer cents to avoid floating-point errors.
3. credit_scores stores a history of score changes — the latest row is the current score.
4. repayments.amount_cents is always positive; the direction is implied by the type.
5. Interest rate is stored as basis points (e.g. 500 = 5.00%) for precision.
*/

-- === 1. credit_accounts ===
CREATE TABLE IF NOT EXISTS credit_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  credit_limit_cents integer NOT NULL DEFAULT 0,
  used_cents integer NOT NULL DEFAULT 0,
  interest_bps integer NOT NULL DEFAULT 0,
  monthly_due_date integer NOT NULL DEFAULT 1 CHECK (monthly_due_date >= 1 AND monthly_due_date <= 28),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'suspended')),
  emergency_credit_cents integer NOT NULL DEFAULT 0,
  emergency_used_cents integer NOT NULL DEFAULT 0,
  credit_freeze_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE credit_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_credit_account" ON credit_accounts;
CREATE POLICY "select_own_credit_account" ON credit_accounts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_credit_account" ON credit_accounts;
CREATE POLICY "insert_own_credit_account" ON credit_accounts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_credit_account" ON credit_accounts;
CREATE POLICY "update_own_credit_account" ON credit_accounts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- === 2. credit_scores ===
CREATE TABLE IF NOT EXISTS credit_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 1000),
  tier text NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'diamond', 'platinum')),
  risk_score integer NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  trust_score integer NOT NULL DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  factors jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE credit_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_credit_scores" ON credit_scores;
CREATE POLICY "select_own_credit_scores" ON credit_scores FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_credit_scores" ON credit_scores;
CREATE POLICY "insert_own_credit_scores" ON credit_scores FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_credit_scores_user ON credit_scores(user_id, created_at DESC);

-- === 3. repayments ===
CREATE TABLE IF NOT EXISTS repayments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  credit_account_id uuid NOT NULL REFERENCES credit_accounts(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  type text NOT NULL DEFAULT 'manual' CHECK (type IN ('manual', 'partial', 'scheduled', 'auto_debit', 'early')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'successful', 'failed', 'cancelled')),
  payment_method text NOT NULL DEFAULT 'wallet' CHECK (payment_method IN ('wallet', 'card', 'bank_transfer', 'instant_eft')),
  due_date timestamptz,
  paid_at timestamptz,
  late_fee_cents integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE repayments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_repayments" ON repayments;
CREATE POLICY "select_own_repayments" ON repayments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_repayments" ON repayments;
CREATE POLICY "insert_own_repayments" ON repayments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_repayments" ON repayments;
CREATE POLICY "update_own_repayments" ON repayments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_repayments_user ON repayments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_repayments_status ON repayments(status);
CREATE INDEX IF NOT EXISTS idx_repayments_due ON repayments(due_date);

-- === 4. credit_events ===
CREATE TABLE IF NOT EXISTS credit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN (
    'limit_increase', 'limit_decrease', 'freeze', 'unfreeze',
    'suspension', 'reactivation', 'late_fee_applied', 'grace_period_started',
    'repayment_reminder', 'credit_used', 'credit_repaid',
    'emergency_credit_granted', 'credit_expired'
  )),
  description text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE credit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_credit_events" ON credit_events;
CREATE POLICY "select_own_credit_events" ON credit_events FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_credit_events" ON credit_events;
CREATE POLICY "insert_own_credit_events" ON credit_events FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_credit_events_user ON credit_events(user_id, created_at DESC);

-- === updated_at triggers ===
DROP TRIGGER IF EXISTS credit_accounts_updated_at ON credit_accounts;
CREATE TRIGGER credit_accounts_updated_at BEFORE UPDATE ON credit_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS repayments_updated_at ON repayments;
CREATE TRIGGER repayments_updated_at BEFORE UPDATE ON repayments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();