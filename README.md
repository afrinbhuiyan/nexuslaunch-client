# 🚀 NexusLaunch

A MERN Stack web platform to discover, share, and manage innovative tech products like web apps, AI tools, games, and more — inspired by [Product Hunt](https://producthunt.com). NexusLaunch allows users to post products, vote, write reviews, subscribe for premium features, and manage roles (User, Moderator, Admin).

## 🌐 Live Website

🔗 [https://nexuslaunch.web.app](https://nexuslaunch.web.app)

---

## 📌 Key Features

### 👤 Authentication
- Firebase Authentication (Email/Password + Google)
- Protected Routes using JWT
- Role-based access (User / Moderator / Admin)

### 🧑‍💻 Normal User Features
- Register & log in securely
- Add one product (can add unlimited after subscription)
- Upvote & review products
- Report inappropriate products

### 🕵️ Moderator Features
- Review and approve/reject submitted products
- Mark products as featured
- Handle reported content

### 🛡️ Admin Features
- Manage user roles (Make Admin / Moderator)
- View dashboard statistics via pie chart
- Manage & advertise coupons

### 📦 Product Features
- Product submission with owner info, description, tags, external link
- Upvote system (1 vote/user, owner can’t vote)
- Tag-based backend search & pagination
- Featured & trending product sections
- Coupon-based membership discount (Stripe Integration)

### 💳 Payment Features
- Stripe integration for paid membership
- Coupon system for dynamic discount via admin panel
- Membership status shows as "Verified" after payment

---

## 📄 Pages & Routes

| Route                        | Description                                      |
|-----------------------------|--------------------------------------------------|
| `/`                         | Home (Banner, Featured, Trending, Coupons)      |
| `/products`                 | All Accepted Products with Search + Pagination   |
| `/product/:id`              | Product Details (Private)                        |
| `/login`                    | Login Page                                       |
| `/register`                 | Registration Page                                |
| `/dashboard`                | Role-based Dashboard                             |
| `/dashboard/add-product`    | Add New Product                                  |
| `/dashboard/my-products`    | Manage Own Products                              |
| `/dashboard/review-queue`   | Moderator Queue                                  |
| `/dashboard/reported`       | Moderator Reported Products                      |
| `/dashboard/statistics`     | Admin Statistics Page                            |
| `/dashboard/users`          | Admin - Manage Users                             |
| `/dashboard/coupons`        | Admin - Manage Coupons                           |
| `*`                         | 404 Error Page                                   |

---

## 🧩 NPM Packages Used

- **Frontend:**
  - `react-router-dom`
  - `firebase`
  - `axios`
  - `sweetalert2`
  - `react-icons`
  - `framer-motion`
  - `@stripe/react-stripe-js`, `@stripe/stripe-js`
  - `react-tag-input`
  - `react-hot-toast`
  - `react-hook-form`
  - `recharts`
  - `lottie-react`
  - `jwt-decode`

- **Backend:**
  - `express`
  - `cors`
  - `mongodb`
  - `jsonwebtoken`
  - `dotenv`
  - `stripe`

---

## 🛡️ Environment Variables

### 🔐 Client-side (`.env`)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=https://nexuslaunch-server.vercel.app
```

### 🔐 Server-side (`.env`)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## 📸 UI Screenshots (Optional)
Add UI screenshots or demo GIFs here to showcase your project visuals.

---

## 💡 Project Purpose

The goal of **NexusLaunch** is to simulate a real-world, production-level MERN application that includes user roles, authentication, payment, moderation, search, and product discovery — preparing candidates for professional developer roles.

---

## ✅ Deployment Notes

- Firebase hosting used for the frontend
- Vercel used for backend deployment
- Environment variables secured
- Firebase domain authorized for OAuth & API
- All private routes use JWT with `axiosSecure` interceptors
- No CORS/404/500 issues on refresh
- Fully responsive across all devices

---

## 👤 Admin Credentials (Demo)

```
Email: admin@nexus.com
Password: 123456
```

> Replace with your real demo login before submission.

---

## 👏 Thanks for checking out NexusLaunch!

Feel free to fork, star ⭐, and explore the code!