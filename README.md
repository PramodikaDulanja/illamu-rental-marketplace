# Illamu.lk – Rental Marketplace Platform

Welcome to the official repository for **Illamu.lk**, a modern, scalable, and secure peer-to-peer and business rental marketplace platform designed to connect renters and item owners seamlessly.

🌐 **Live Website:** [illamu-rental-marketplace.vercel.app](https://illamu-rental-marketplace.vercel.app/)

---

## 📱 About Illamu.lk

Illamu.lk is a cloud-powered web application that simplifies the rental process. It enables users to easily list items, browse diverse categories, filter items by specific locations/districts, and securely manage their rental needs all in one place.

## ✨ Core Features

- **Item Management:** Post, update, and manage rental ads with detailed descriptions and categories.
- **Smart Filtering:** Filter available items seamlessly by category, district, and sub-location.
- **User Authentication:** Secure user sign-up and sign-in functionality.
- **Responsive UI:** Modern, mobile-friendly interface styled with Tailwind CSS.
- **Cloud Database:** Robust data handling via PostgreSQL and Supabase.

## 🛠️ Tech Stack

| Layer              | Technology                        |
| :----------------- | :-------------------------------- |
| **Framework**      | Next.js (App Router), TypeScript  |
| **Styling**        | Tailwind CSS                      |
| **Database & ORM** | Supabase (PostgreSQL), Prisma ORM |
| **Authentication** | NextAuth.js                       |
| **Deployment**     | Vercel                            |

## 🚀 Getting Started Locally

To run this project locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PramodikaDulanja/illamu-rental-marketplace.git
   cd illamu-rental-marketplace
   ```

### 2. Install Dependencies

```insstall
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL="your_supabase_pooler_url"
DIRECT_URL="your_supabase_direct_url"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

4. Run the Development Server

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
