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
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  address_line_1 VARCHAR(100),
  address_line_2 VARCHAR(100),
  password_salt VARCHAR(60) NOT NULL,
  password_hash VARCHAR(60) NOT NULL,
  zip_code VARCHAR(5),
  phone_number VARCHAR(20),
  -- This should go into a separate table (user_roles)
  user_role VARCHAR(20) CHECK (user_role IN ('consumer', 'driver', 'admin')),
  location_id INT REFERENCES locations(id) ON DELETE CASCADE ON UPDATE CASCADE,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE parcels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  parcel_weight DECIMAL(10, 2),
  special_instructions TEXT,
  parcel_size VARCHAR(2) NOT NULL CHECK (UPPER(parcel_size) IN ('S', 'M', 'L', 'XL')),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  driver_id UUID REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  parcel_status VARCHAR(20) CHECK (parcel_status IN ('pending', 'in-transit', 'ready-to-pickup', 'delivered')),
  delivery_code VARCHAR(6) DEFAULT NULL,
  picked_up_at TIMESTAMP DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cabinets (
  id SERIAL PRIMARY KEY,
  cabinet_size VARCHAR(2) CHECK (UPPER(cabinet_size) IN ('S', 'M', 'L', 'XL')),
  cabinet_status VARCHAR(15) CHECK (cabinet_status IN ('available', 'reserved', 'in-use', 'out-of-service')),
  parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE ON UPDATE CASCADE,
  location_id INT NOT NULL REFERENCES locations(id) ON DELETE CASCADE ON UPDATE CASCADE,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
