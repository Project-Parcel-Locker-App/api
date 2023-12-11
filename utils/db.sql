------ pulssiposti_db - Tables ----------

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  street VARCHAR(100) NOT NULL,
  zip_code INT NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(60) NOT NULL,
  refresh_token VARCHAR(255),
  phone_number VARCHAR(20),
  user_role VARCHAR(20) CHECK (user_role IN ('consumer', 'driver', 'admin')),
  location_id INT REFERENCES locations(id) ON DELETE CASCADE ON UPDATE CASCADE,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE parcels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sending_code VARCHAR(6),
  pickup_code VARCHAR(6),
  parcel_weight DECIMAL(10, 2),
  special_instructions TEXT,
  parcel_size VARCHAR(2) NOT NULL CHECK (UPPER(parcel_size) IN ('S', 'M', 'L', 'XL')),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  driver_id UUID REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  parcel_status VARCHAR(20) CHECK (parcel_status IN ('pending', 'in-transit', 'ready-for-pickup', 'delivered')),
  ready_for_pickup_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cabinets (
  id SERIAL PRIMARY KEY,
  locker_id INT NOT NULL,
  cabinet_size VARCHAR(2) CHECK (UPPER(cabinet_size) IN ('S', 'M', 'L', 'XL')),
  parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE ON UPDATE CASCADE,
  location_id INT NOT NULL REFERENCES locations(id) ON DELETE CASCADE ON UPDATE CASCADE,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
