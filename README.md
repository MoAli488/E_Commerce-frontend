# form. — Modern E-Commerce Platform (Frontend)

<p align="center">
  <strong>An editorial, minimal, and performant e-commerce web application built with Angular 22.</strong><br>
  Developed as part of the <strong>National Telecommunication Institute (NTI)</strong> Full-Stack Development track.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-22-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 22" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS" />
  <img src="https://img.shields.io/badge/Vitest-5.0-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Customer Storefront](#customer-storefront)
  - [Admin Dashboard](#admin-dashboard)
- [Design Philosophy & UI](#-design-philosophy--ui)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Application Flow & Routes](#-application-flow--routes)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 🌟 Overview

**form.** is a modern full-stack e-commerce solution focused on delivering an elegant, distraction-free shopping experience for contemporary fashion and everyday essentials.

This repository contains the **Frontend** application, engineered with the latest Angular 22 features including **Standalone Components**, **Signals**, **Typed Reactive Forms**, **Modern Control Flow (`@if`, `@for`, `@switch`)**, **Functional Guards & Interceptors**, and custom CSS with responsive architectural typography.

---

## ✨ Key Features

### Customer Storefront

- **Home & Editorial Landing**:
  - Hero banner with seasonal callouts.
  - Value proposition strip (Quality materials, 30-day returns, free shipping).
  - Featured product collection with live category filtering.
  - Brand manifesto showcase.
  - **Community Testimonials**: Approved customer reviews, star rating summary, and interactive modal for verified users to submit new reviews.
- **Catalog & Discovery**:
  - Full-text search by product title.
  - Category pill filters with dynamic active states.
  - Price range selector (`Under $50`, `$50 to $100`, `Over $100`).
  - Server-side pagination with clean navigation buttons.
- **Product Details**:
  - High-resolution product showcase.
  - Dynamic stock awareness indicators (_"Only 2 left"_, _"In Stock"_, _"Out of Stock"_).
  - Interactive quantity stepper (restricted to available inventory).
  - Instant Add-to-Bag with feedback banner and quick navigation.
- **Cart & Guest Cart Experience**:
  - **Persistent Guest Cart**: Unauthenticated visitors can add, update, and manage cart items in `localStorage`.
  - **Seamless Cart Merging**: Automatically syncs and merges guest cart items with the user's server cart upon logging in or signing up.
  - Live subtotal and quantity calculation.
  - Price modification alerts if item prices change.
- **Streamlined Checkout**:
  - Delivery address selection: choose from saved user addresses (with default flag) or input a new delivery address.
  - Egyptian phone number validation (`/^(\+20|0)?1[0125][0-9]{8}$/`).
  - Cash on Delivery (COD) payment flow.
- **Customer Account & Orders**:
  - Order history tracking with real-time status badges (`pending`, `preparing`, `shipped`, `delivered`, `cancelled`, `refunded`).
  - Personal profile editor (name, phone number).
  - Saved Address Book with default address configuration.
- **Informational Pages**:
  - Tabbed information hub covering **About Us**, **Contact Concierge** (with interactive message feedback), **FAQ & Shipping**, and **Store Policies**.
- **Branded 404 Experience**:
  - Dedicated custom error page guiding users back to active collections.

### Admin Dashboard

- **Protected by `adminGuard`**: Restricted strictly to authorized administrative accounts.
- **Executive Overview**: High-level KPI cards displaying live total users, active products, total orders, and pending orders awaiting fulfillment.
- **Product Management**:
  - Searchable data table with product thumbnails, price, and stock indicators.
  - Soft-delete capability to preserve historical order integrity.
  - Add product modal with image file upload, category slug generation, and real-time previews.
- **Order Processing**:
  - Filter orders by status or search across customer name, email, phone, and order ID.
  - Live status update dropdown with instant state synchronization.
- **User Directory**:
  - Comprehensive user listing with role badges (`Admin` / `User`) and status flags (`Active`, `Blocked`, `Deleted`).
  - Create administrative or standard user accounts.

---

## 🎨 Design Philosophy & UI

- **Color Palette**: Warm minimalist neutrals (`#fbfaf6`, `#ffffff`, `#252a23`) balanced with terracotta accents (`#a45d42`, `#c56b4b`).
- **Typography**: Clean modern sans-serif (`DM Sans`) paired with editorial serif italic highlights (`Georgia`).
- **Micro-Interactions**: Smooth hover elevations, button arrow translations, and animated modal transitions.
- **Responsive**: Fully responsive layouts tailored for mobile, tablet, and widescreen desktop displays.

---

## 🛠 Tech Stack

- **Framework**: Angular 22 (Standalone Architecture)
- **Language**: TypeScript 6.0
- **State Management**: Angular Signals (`signal`, `computed`), RxJS `BehaviorSubject` & Observables
- **Forms**: Reactive Forms (`FormGroup`, `FormControl`, custom validators)
- **Routing**: Angular Router with functional `CanActivateFn` and `CanDeactivateFn` guards
- **HTTP Client**: `provideHttpClient()` with functional interceptors (`authInterceptor`, `errorHandlerInterceptor`)
- **Unit Testing**: Vitest 5.0

---

## 📁 Project Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/              # auth-guard, admin-guard, guest-guard, signup-guard
│   │   │   ├── interceptors/        # auth-interceptor, error-handler-interceptor
│   │   │   ├── models/              # TypeScript interfaces (Product, Cart, Order, User, etc.)
│   │   │   ├── services/            # Angular services (Auth, Cart, Order, Product, User, Testimonial)
│   │   │   └── validators/          # Custom validators (password strength, matching)
│   │   ├── dashboard/               # Admin dashboard modules
│   │   │   ├── home/                # Metrics & KPI overview
│   │   │   ├── product-list/        # Admin product table
│   │   │   ├── create-product/      # Product addition form
│   │   │   ├── order-list/          # Admin order management
│   │   │   ├── user-list/           # User administration
│   │   │   └── create-user/         # Admin user creation
│   │   ├── layout/                  # Public customer storefront
│   │   │   ├── home/                # Landing page & hero
│   │   │   ├── product-list/        # Catalog, search, filters & product card
│   │   │   │   ├── product/         # Standalone product card
│   │   │   │   └── product-details/ # Product detail view
│   │   │   ├── cart/                # Shopping cart
│   │   │   │   └── checkout/        # Checkout & address selection
│   │   │   ├── orders/              # Customer order history
│   │   │   ├── user-profile/        # Profile & address book
│   │   │   ├── login/               # Sign-in page
│   │   │   ├── signup/              # Registration page
│   │   │   ├── info-page/           # About, Contact, FAQ, Policies
│   │   │   ├── testimonial/         # Customer reviews section
│   │   │   │   └── testimonial-card/# Standalone review card
│   │   │   └── shared/header/       # Storefront navigation header
│   │   ├── shared/
│   │   │   ├── footer/              # Global footer
│   │   │   └── not-found/           # 404 Error page
│   │   ├── app.routes.ts            # Application route definitions
│   │   ├── app.config.ts            # Angular app configuration & providers
│   │   └── app.ts                   # Root component
│   ├── enviroment/
│   │   ├── env.ts                   # Local development API URLs
│   │   └── env.prod.ts              # Production environment configuration
│   ├── styles.css                   # Global styles & font imports
│   └── index.html
├── package.json
├── tsconfig.json
└── angular.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v20.x` or later (Node.js 22+ recommended)
- **npm**: `v10.x` or later
- **Angular CLI**: `npm install -g @angular/cli`

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/form-ecommerce-frontend.git
   cd form-ecommerce-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Verify the backend API configuration in `enviroment/env.ts`:
   ```typescript
   export const enviroment = {
     apiURL: 'http://localhost:3000/api/v1/',
     staticURL: 'http://localhost:3000/files/',
     isProduction: false,
   };
   ```

### Development Server

Start the local development server:

```bash
npm start
# or: ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any source files.

### Production Build

To build the project for production deployment:

```bash
npm run build
```

The build artifacts will be stored in the `dist/frontend` directory ready to be served by any static web host or CDN.

---

## 🗺 Application Flow & Routes

| Path                        | Component             | Guard / Access | Description                           |
| --------------------------- | --------------------- | -------------- | ------------------------------------- |
| `/`                         | `Layout`              | Public         | Redirects to `/home`                  |
| `/home`                     | `Home`                | Public         | Editorial landing page & testimonials |
| `/product-list`             | `ProductList`         | Public         | Search, filter, and browse catalog    |
| `/product-details/:slug`    | `ProductDetails`      | Public         | Single product view & Add-to-Bag      |
| `/cart`                     | `Cart`                | Public         | Shopping bag with guest cart support  |
| `/cart/checkout`            | `Checkout`            | `authGuard`    | Delivery address & order placement    |
| `/orders`                   | `Orders`              | `authGuard`    | Customer order history & tracking     |
| `/user-profile`             | `UserProfile`         | `authGuard`    | Personal profile & Address book       |
| `/login`                    | `Login`               | `guestGuard`   | Customer / Admin sign in              |
| `/signup`                   | `Signup`              | `guestGuard`   | Customer registration                 |
| `/info/:page`               | `InfoPage`            | Public         | About, Contact, FAQ, Policies         |
| `/dashboard`                | `Dashboard`           | `adminGuard`   | Admin layout wrapper                  |
| `/dashboard/home`           | `Home` (Dashboard)    | `adminGuard`   | Store metrics & analytics             |
| `/dashboard/products`       | `ProductList` (Admin) | `adminGuard`   | Product inventory table               |
| `/dashboard/create-product` | `CreateProduct`       | `adminGuard`   | Add new product form                  |
| `/dashboard/orders`         | `OrderList`           | `adminGuard`   | Process & update order status         |
| `/dashboard/users`          | `UserList`            | `adminGuard`   | Customer & Admin directory            |
| `/**`                       | `NotFound`            | Public         | Custom 404 page                       |

---

## 👨‍💻 Author & Acknowledgments

- **Developer**: Mohamed Ali
- **Organization**: National Telecommunication Institute (NTI)
- **Role**: Full-Stack Web Development Track

---

<p align="center">
  <sub>Built with care for everyday essentials. © 2026 form. All rights reserved.</sub>
</p>
