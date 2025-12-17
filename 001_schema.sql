-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT now(),
  kyc_status TEXT DEFAULT 'none' -- none, pending, verified, rejected
);

-- Wallets (segregated per user)
CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  currency TEXT NOT NULL,
  balance_bigint BIGINT DEFAULT 0, -- store cents or satoshi
  created_at TIMESTAMP DEFAULT now()
);

-- Ledger entries
CREATE TABLE IF NOT EXISTS ledger (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallets(id),
  type TEXT NOT NULL, -- deposit, withdrawal, trade, tip, fee, adjustment
  amount_bigint BIGINT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  side TEXT NOT NULL, -- buy or sell
  amount_bigint BIGINT NOT NULL,
  price_numeric NUMERIC,
  status TEXT DEFAULT 'open', -- open, filled, cancelled
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tips
CREATE TABLE IF NOT EXISTS tips (
  id SERIAL PRIMARY KEY,
  from_user INTEGER REFERENCES users(id),
  to_user INTEGER REFERENCES users(id),
  amount_bigint BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);


-- Withdrawals (pending requests)
CREATE TABLE IF NOT EXISTS withdrawals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  wallet_id INTEGER REFERENCES wallets(id),
  amount_bigint BIGINT NOT NULL,
  address TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  processed_at TIMESTAMP
);

-- Trades simple record
CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  buy_order INTEGER REFERENCES orders(id),
  sell_order INTEGER REFERENCES orders(id),
  price_numeric NUMERIC,
  amount_bigint BIGINT,
  created_at TIMESTAMP DEFAULT now()
);
