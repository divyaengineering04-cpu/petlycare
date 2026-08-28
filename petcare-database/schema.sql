-- PetCare SQLite Database Schema
-- Production-ready schema with constraints, indexes, and foreign keys
PRAGMA foreign_keys = ON;

-- 1. users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    address TEXT,
    avatar TEXT,
    createdAt TEXT NOT NULL
);

-- 2. services table
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    iconName TEXT NOT NULL,
    shortDescription TEXT NOT NULL,
    fullDescription TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    duration TEXT NOT NULL,
    popular INTEGER DEFAULT 0 CHECK (popular IN (0, 1)),
    rating REAL DEFAULT 5.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    image TEXT NOT NULL
);

-- 3. pets table
CREATE TABLE IF NOT EXISTS pets (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    breed TEXT NOT NULL,
    age TEXT NOT NULL,
    gender TEXT NOT NULL,
    weight TEXT NOT NULL,
    vaccinationStatus TEXT NOT NULL,
    image TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. marketplace_pets table
CREATE TABLE IF NOT EXISTS marketplace_pets (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    breed TEXT NOT NULL,
    age TEXT NOT NULL,
    gender TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'pending', 'sold', 'adopted')),
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    petId TEXT NOT NULL,
    serviceId TEXT NOT NULL,
    bookingDate TEXT NOT NULL,
    bookingTime TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    paymentStatus TEXT NOT NULL DEFAULT 'pending' CHECK (paymentStatus IN ('pending', 'paid', 'refunded', 'failed')),
    amount INTEGER NOT NULL CHECK (amount >= 0),
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (petId) REFERENCES pets(id) ON DELETE CASCADE,
    FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE RESTRICT
);

-- 6. reminders table
CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    petId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    reminderDate TEXT NOT NULL,
    reminderTime TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'snoozed', 'cancelled')),
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (petId) REFERENCES pets(id) ON DELETE CASCADE
);

-- 7. emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    relationship TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Performance & Foreign Key Indexes
CREATE INDEX IF NOT EXISTS idx_pets_userId ON pets(userId);
CREATE INDEX IF NOT EXISTS idx_marketplace_pets_userId ON marketplace_pets(userId);
CREATE INDEX IF NOT EXISTS idx_marketplace_pets_status ON marketplace_pets(status);
CREATE INDEX IF NOT EXISTS idx_bookings_userId ON bookings(userId);
CREATE INDEX IF NOT EXISTS idx_bookings_petId ON bookings(petId);
CREATE INDEX IF NOT EXISTS idx_bookings_serviceId ON bookings(serviceId);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reminders_userId ON reminders(userId);
CREATE INDEX IF NOT EXISTS idx_reminders_petId ON reminders(petId);
CREATE INDEX IF NOT EXISTS idx_reminders_reminderDate ON reminders(reminderDate);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_userId ON emergency_contacts(userId);


-- Sample data insertion
INSERT INTO users (id, name, email, phone, password, address, avatar, createdAt) VALUES
('usr_11111111-2222-3333-4444-555555555551', 'Alex Johnson', 'alex.johnson@example.com', '+1-555-0199', '$2b$12$e8Y2i9D0PqVn3KzL1w9Mxe8Q4XjK7mY3fT6vN5gR0pL2qW8sE4uY2', '123 Market St, San Francisco, CA 94103', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', '2026-01-10T08:00:00Z'),
('usr_11111111-2222-3333-4444-555555555552', 'Sarah Connor', 'sarah.connor@example.com', '+1-555-0144', '$2b$12$t4K7mY3fT6vN5gR0pL2qWe8Y2i9D0PqVn3KzL1w9Mxe8Q4XjK8sE4', '456 Sunset Blvd, Los Angeles, CA 90028', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', '2026-01-15T09:30:00Z'),
('usr_11111111-2222-3333-4444-555555555553', 'Dr. Michael Chen', 'dr.chen@petcareclinic.com', '+1-555-0177', '$2b$12$w9Mxe8Q4XjK7mY3fT6vN5ge8Y2i9D0PqVn3KzL1R0pL2qW8sE4uY2', '789 Broadway Ave, Seattle, WA 98102', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', '2026-01-20T14:15:00Z');

INSERT INTO services (id, name, category, iconName, shortDescription, fullDescription, price, duration, popular, rating, image) VALUES
('srv_22222222-3333-4444-5555-666666666661', 'Full Grooming & Spa', 'Grooming', 'scissors', 'Complete bath, haircut, ear cleaning, and nail trimming.', 'Our premier full-service grooming package includes organic coat shampooing, gentle blow dry, breed-specific styling, ear cleaning, nail clipping, and paw balm soothing massage.', 65, '75 mins', 1, 4.9, 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7'),
('srv_22222222-3333-4444-5555-666666666662', 'Comprehensive Vet Checkup', 'Healthcare', 'stethoscope', 'Full physical wellness examination & preventative consultation.', 'Thorough nose-to-tail veterinary wellness exam including vital monitoring, cardiopulmonary check, oral/dental inspection, abdominal palpation, and nutritional guidance.', 50, '30 mins', 1, 4.8, 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def'),
('srv_22222222-3333-4444-5555-666666666663', 'Core Vaccination Bundle', 'Healthcare', 'syringe', 'Essential immunization protection against Rabies, DHPP, and FVRCP.', 'Veterinarian-administered core vaccines tailored to dogs and cats to prevent rabies, parvovirus, distemper, and feline viral rhinotracheitis with an official health certificate.', 40, '20 mins', 0, 5.0, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97'),
('srv_22222222-3333-4444-5555-666666666664', 'Overnight Pet Hotel & Boarding', 'Boarding', 'home', 'Safe, climate-controlled luxury boarding with 24/7 care.', 'Spacious luxury suites with orthopedic bedding, 4 outdoor play sessions per day, webcam streaming access, personalized feeding routines, and 24/7 veterinary supervision.', 85, '24 hours', 1, 4.9, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1');

INSERT INTO pets (id, userId, name, type, breed, age, gender, weight, vaccinationStatus, image, notes, createdAt) VALUES
('pet_33333333-4444-5555-6666-777777777771', 'usr_11111111-2222-3333-4444-555555555551', 'Max', 'Dog', 'Golden Retriever', '3 years', 'Male', '31 kg', 'Up to Date', 'https://images.unsplash.com/photo-1552053831-71594a27632d', 'Super friendly with other dogs. Mild allergy to chicken.', '2026-02-01T10:00:00Z'),
('pet_33333333-4444-5555-6666-777777777772', 'usr_11111111-2222-3333-4444-555555555551', 'Luna', 'Cat', 'British Shorthair', '2 years', 'Female', '4.2 kg', 'Up to Date', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 'Prefers quiet environments. Enjoys feather wand play.', '2026-02-15T14:30:00Z'),
('pet_33333333-4444-5555-6666-777777777773', 'usr_11111111-2222-3333-4444-555555555552', 'Rocky', 'Dog', 'French Bulldog', '1.5 years', 'Male', '12.5 kg', 'Pending Booster', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', 'Requires eye drops twice daily after meals.', '2026-03-01T11:20:00Z');

INSERT INTO marketplace_pets (id, userId, name, type, breed, age, gender, price, image, description, location, status, createdAt) VALUES
('mkt_44444444-5555-6666-7777-888888888881', 'usr_11111111-2222-3333-4444-555555555552', 'Bella', 'Dog', 'Shih Tzu', '3 months', 'Female', 650, 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a', 'Energetic and affectionate purebred puppy. First vaccinations and deworming completed. Vet health checked.', 'Los Angeles, CA', 'available', '2026-08-01T10:00:00Z'),
('mkt_44444444-5555-6666-7777-888888888882', 'usr_11111111-2222-3333-4444-555555555553', 'Milo', 'Cat', 'Ragdoll', '4 months', 'Male', 800, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5', 'Stunning blue-eyed kitten with sweet and gentle temperament. Litter trained, microchipped, and vaccinated.', 'Seattle, WA', 'available', '2026-08-10T12:00:00Z'),
('mkt_44444444-5555-6666-7777-888888888883', 'usr_11111111-2222-3333-4444-555555555551', 'Coco', 'Bird', 'Cockatiel', '1 year', 'Female', 150, 'https://images.unsplash.com/photo-1552728089-57bdde30beb3', 'Hand-tamed and whistling friendly melodies. Comes with starter cage and organic pellet food.', 'San Francisco, CA', 'pending', '2026-08-15T15:30:00Z');

INSERT INTO bookings (id, userId, petId, serviceId, bookingDate, bookingTime, status, paymentStatus, amount, createdAt) VALUES
('bok_55555555-6666-7777-8888-999999999991', 'usr_11111111-2222-3333-4444-555555555551', 'pet_33333333-4444-5555-6666-777777777771', 'srv_22222222-3333-4444-5555-666666666661', '2026-09-05', '10:00 AM', 'confirmed', 'paid', 65, '2026-08-20T08:15:00Z'),
('bok_55555555-6666-7777-8888-999999999992', 'usr_11111111-2222-3333-4444-555555555551', 'pet_33333333-4444-5555-6666-777777777772', 'srv_22222222-3333-4444-5555-666666666662', '2026-09-08', '02:30 PM', 'pending', 'pending', 50, '2026-08-22T11:45:00Z'),
('bok_55555555-6666-7777-8888-999999999993', 'usr_11111111-2222-3333-4444-555555555552', 'pet_33333333-4444-5555-6666-777777777773', 'srv_22222222-3333-4444-5555-666666666663', '2026-09-12', '09:00 AM', 'confirmed', 'paid', 40, '2026-08-25T16:00:00Z');

INSERT INTO reminders (id, userId, petId, title, description, reminderDate, reminderTime, status, createdAt) VALUES
('rem_66666666-7777-8888-9999-000000000001', 'usr_11111111-2222-3333-4444-555555555551', 'pet_33333333-4444-5555-6666-777777777771', 'Heartworm Prevention Chewable', 'Give 1 chewable tablet of Heartgard Plus with morning breakfast.', '2026-09-01', '08:00 AM', 'pending', '2026-08-20T09:00:00Z'),
('rem_66666666-7777-8888-9999-000000000002', 'usr_11111111-2222-3333-4444-555555555551', 'pet_33333333-4444-5555-6666-777777777772', 'Annual Rabies Vaccine Booster', 'Book veterinary vaccination slot at downtown clinic.', '2026-09-15', '10:00 AM', 'pending', '2026-08-22T12:00:00Z'),
('rem_66666666-7777-8888-9999-000000000003', 'usr_11111111-2222-3333-4444-555555555552', 'pet_33333333-4444-5555-6666-777777777773', 'Administer Eye Drops', 'Apply 2 drops of prescribed antibiotic eye solution into left eye.', '2026-08-29', '08:30 AM', 'pending', '2026-08-26T07:30:00Z');

INSERT INTO emergency_contacts (id, userId, name, phone, relationship, createdAt) VALUES
('emc_77777777-8888-9999-0000-111111111111', 'usr_11111111-2222-3333-4444-555555555551', 'Bay Area 24/7 Animal Emergency Hospital', '+1-415-555-9111', 'Primary Emergency Vet Clinic', '2026-01-20T10:00:00Z'),
('emc_77777777-8888-9999-0000-111111111112', 'usr_11111111-2222-3333-4444-555555555551', 'Robert Johnson', '+1-415-555-0234', 'Brother & Alternate Caretaker', '2026-01-20T10:05:00Z'),
('emc_77777777-8888-9999-0000-111111111113', 'usr_11111111-2222-3333-4444-555555555552', 'LA Metro Veterinary Trauma Center', '+1-310-555-9999', '24/7 Emergency Hospital', '2026-03-05T15:00:00Z');
