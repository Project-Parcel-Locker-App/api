------ pulssiposti_db - Tables ----------

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  street VARCHAR(100) NOT NULL,
  zip_code INT NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_salt VARCHAR(60) NOT NULL,
  password_hash VARCHAR(60) NOT NULL,
  phone_number VARCHAR(100),
  location_id INT REFERENCES locations(id) ON DELETE CASCADE ON UPDATE CASCADE,
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE drivers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(60) NOT NULL,
  driver_status VARCHAR(10) CHECK (driver_status IN ('available', 'on-delivery', 'break')),
  location_id INT NOT NULL REFERENCES locations(id) ON DELETE CASCADE ON UPDATE CASCADE,
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE parcels (
  id SERIAL PRIMARY KEY,
  parcel_weight DECIMAL(10, 2),
  special_instructions TEXT,
  parcel_size CHAR(2) NOT NULL CHECK (UPPER(parcel_size) IN ('S', 'M', 'L', 'XL')),
  sender_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  recipient_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  driver_id INT NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  parcel_status VARCHAR(10) CHECK (UPPER(parcel_status) IN ('pending', 'in-transit', 'driver-pickedup', 'ready-to-pickup', 'delivered')),
  pickup_code VARCHAR(6),
  delivery_code VARCHAR(6),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE lockers (
  id SERIAL PRIMARY KEY,
  location_id INT NOT NULL REFERENCES locations(id) ON DELETE CASCADE ON UPDATE CASCADE,
  demand_level CHAR(2) CHECK (UPPER(demand_level) IN ('L', 'M', 'H')),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cabinets (
  id SERIAL PRIMARY KEY,
  cabinet_status CHECK (UPPER(cabinet_status) IN ('available', 'reserved', 'in-use', 'out-of-service')),
  cabinet_size CHAR(2) CHECK (UPPER(cabinet_size) IN ('S', 'M', 'L', 'XL')),
  parcel_id INT REFERENCES parcels(id) ON DELETE CASCADE ON UPDATE CASCADE,
  locker_id INT NOT NULL REFERENCES lockers(id) ON DELETE SET NULL ON UPDATE CASCADE,
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
