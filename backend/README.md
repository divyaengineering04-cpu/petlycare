# Pet Care REST API Backend

A feature-rich Node.js + Express REST API backend with SQLite database persistence, JWT authentication, and full CRUD for the Pet Care web application.

## 🚀 Features

- **Authentication**: JWT auth, bcrypt password hashing, login & register endpoints, user profile management.
- **Pets Management**: Full CRUD for pet profiles (dogs, cats, birds, rabbits, etc.).
- **Services Catalog**: List of pet grooming, vet consultation, pet walking, sitting, and taxi services.
- **Bookings & Payments**: Instant service booking, status management, online payment simulation with transaction IDs, and cancellation with refund tracking.
- **Pet Marketplace**: List pets for sale/adoption, purchase/adopt pets with automatic addition to buyer's pet list.
- **Health Reminders**: Schedule vaccination, medication, and grooming reminders with status toggling.
- **Emergency SOS & Helplines**: 24/7 veterinary hospitals, pet ambulances, and poison control helplines.
- **Database Persistence**: File-based SQLite (`petcare.db`) with automatic table creation and demo seeding.

---

## 📌 API Endpoints

### 🔑 Auth (`/api/auth`)
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate user & return JWT token
- `GET /api/auth/verify-email?token=...` - Verify a new user's email address
- `GET /api/auth/me` - Get logged-in user profile (Requires Auth Header: `Bearer <token>`)
- `PUT /api/auth/profile` - Update user profile details (Requires Auth Header)

### 🐶 Pets (`/api/pets`) - All require Auth
- `GET /api/pets` - List all pets for logged in user
- `GET /api/pets/:id` - Get specific pet details
- `POST /api/pets` - Add new pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

### ✂️ Services (`/api/services`)
- `GET /api/services` - List available services
- `GET /api/services/:id` - Get service details

### 📅 Bookings (`/api/bookings`) - All require Auth
- `GET /api/bookings` - List user's service bookings
- `POST /api/bookings` - Create new service booking
- `POST /api/bookings/:id/pay` - Process payment for booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

### 🛍️ Marketplace (`/api/marketplace`)
- `GET /api/marketplace` - List marketplace pets for sale/adoption
- `POST /api/marketplace` - Create listing (Requires Auth)
- `POST /api/marketplace/:id/buy` - Adopt/Buy pet listing (Requires Auth)

### ⏰ Health Reminders (`/api/reminders`) - All require Auth
- `GET /api/reminders` - Get health reminders
- `POST /api/reminders` - Create reminder
- `PATCH /api/reminders/:id/toggle` - Toggle reminder Active/Completed
- `DELETE /api/reminders/:id` - Delete reminder

### 🚑 Emergency (`/api/emergency`)
- `GET /api/emergency` - Get 24/7 hospitals and emergency helplines

### 🔄 Database Reset / Seed (`/api/seed`)
- `POST /api/seed` - Reset and seed database with demo data

---

## 🛠️ How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
# or for auto-reload development mode:
npm run dev
```

The server will run at: `http://localhost:3000`

New accounts must verify their email before login. For real email delivery, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and optionally `SMTP_FROM` in `.env`. Without SMTP settings, development responses include a verification URL.

