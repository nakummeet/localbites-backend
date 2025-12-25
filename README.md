🍽️ LocalBites Backend

LocalBites is a full-stack food ordering backend built with Node.js, Express, MongoDB, designed to support users and restaurant owners with role-based access, cart management, and order processing.

This repository contains the backend API powering the LocalBites mobile app (Flutter).

🚀 Features
🔐 Authentication & Authorization

JWT-based authentication

Role-based access (user, owner)

Secure protected routes

🏪 Restaurant Management (Owner)

Create restaurant (one per owner)

Add food items

Update food details

Delete food

Toggle food availability

🍔 Food Management

Fetch foods by restaurant

Default food image support

Availability control

🛒 Cart System (User)

One cart per user

Add food to cart

Update quantity

Remove items

Cart total calculation handled by backend

📦 Order System

Place order from cart

Cart cleared after order confirmation

User order history

Owner order dashboard

Order status updates (pending, confirmed, preparing, delivered, cancelled)

🧱 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

bcryptjs (password hashing)

Vercel (deployment)

🌍 Live API Base URL
https://<your-vercel-backend-url>


Replace with your deployed Vercel backend URL.

🔑 Authentication Flow

User/Owner signs up

Login returns JWT token

Token must be sent in all protected requests:

Authorization: Bearer <JWT_TOKEN>

📚 API Endpoints Overview
Auth
Method	Endpoint	Description
POST	/api/auth/signup	Register user / owner
POST	/api/auth/signin	Login and get token
Restaurants
Method	Endpoint	Access
POST	/api/restaurants	Owner
GET	/api/restaurants	Public
Foods
Method	Endpoint	Access
POST	/api/foods	Owner
GET	/api/foods/restaurant/:id	Public
PUT	/api/foods/:id	Owner
DELETE	/api/foods/:id	Owner
PATCH	/api/foods/:id/toggle	Owner
Cart
Method	Endpoint	Access
POST	/api/cart/add	User
GET	/api/cart	User
PUT	/api/cart/update	User
DELETE	/api/cart/remove/:foodId	User
Orders
Method	Endpoint	Access
POST	/api/orders/place	User
GET	/api/orders/my	User
GET	/api/orders/restaurant	Owner
PUT	/api/orders/:id/status	Owner
🧠 Important Backend Rules

Cart is backend-controlled, not frontend-controlled

JWT token must be sent on every protected request

User cart is cleared after order placement

Owners can manage only their own restaurant

Role enforcement handled entirely by backend

⚙️ Environment Variables

Create a .env file:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

▶️ Run Locally
npm install
npx nodemon api/index.js


Server runs at:

http://localhost:3000

🧪 Testing

Tested using Postman

All endpoints validated with:

valid token

invalid token

role mismatch

empty cart

order flow

📱 Frontend

Frontend is built using Flutter

Backend designed for mobile-first usage

Stateless API design

🛡️ Security Notes

Passwords are hashed using bcrypt

JWT tokens expire automatically

No sensitive data exposed in responses

🧩 Future Enhancements

Payment gateway integration

Admin dashboard

Restaurant analytics

Search & filters

Ratings & reviews

👨‍💻 Author

Meet Nakum
Built with ❤️ for learning, scaling, and real-world usage.