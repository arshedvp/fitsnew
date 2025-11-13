# FitsNew E-Commerce Website

## Project Overview
A premium full-stack e-commerce platform for FitsNew clothing brand with FitsAgain vintage sub-brand. All orders are processed through WhatsApp (+918606721229) without user authentication.

## Features
- **No Login Required**: Browse and shop without creating an account
- **WhatsApp Ordering**: Single product and cart-based ordering via WhatsApp
- **Dual Brands**: FitsNew (contemporary) and FitsAgain (vintage/thrift)
- **Product Management**: Admin dashboard for managing inventory
- **Responsive Design**: Mobile-first design with premium aesthetics
- **Cart System**: LocalStorage-based shopping cart
- **Categories**: T-Shirts, Shirts, Jeans, Jackets, Pants, Vintage

## Tech Stack
### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Shadcn UI components
- TailwindCSS for styling
- Inter & Space Grotesk fonts
- LocalStorage for cart persistence

### Backend
- Express.js
- In-memory storage (MemStorage)
- JWT for admin authentication
- bcryptjs for password hashing

## Project Structure
```
client/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CartDrawer.tsx
│   │   └── ProductForm.tsx
│   ├── pages/            # Route pages
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── FitsAgain.tsx
│   │   ├── Cart.tsx
│   │   ├── AdminLogin.tsx
│   │   └── AdminDashboard.tsx
│   ├── lib/              # Utilities
│   │   ├── cart.ts       # Cart management
│   │   ├── whatsapp.ts   # WhatsApp message generation
│   │   └── queryClient.ts
│   └── App.tsx
server/
├── index.ts
├── routes.ts             # API endpoints
└── storage.ts            # Data storage layer
shared/
└── schema.ts             # Shared types and schemas
```

## Key Pages
1. **Home** (`/`): Hero, categories, trending products, FitsAgain highlight
2. **Shop** (`/shop`): Product listing with filters and search
3. **Product Detail** (`/product/:id`): Gallery, size selection, WhatsApp ordering
4. **FitsAgain** (`/fitsagain`): Vintage collection showcase
5. **Cart** (`/cart`): Full cart management with WhatsApp checkout
6. **Admin Login** (`/admin/login`): Admin authentication
7. **Admin Dashboard** (`/admin/dashboard`): Product CRUD operations

## WhatsApp Integration
### Single Product Order
```
Hello, I want to order this product from FitsNew:

Product: [Product Name]
Price: ₹[Price]
Size: [Selected Size]
Quantity: 1
Product ID: [ID]
Product Link: [URL]

Please confirm availability.
```

### Cart Checkout
```
Hello, I want to place an order from FitsNew:

1) [Product Name]
   Size: [Size]
   Qty: [Quantity]
   Price: ₹[Price]

2) [Next Product]
   ...

Total Items: [count]
Grand Total: ₹[total]

Please confirm product availability.
```

## Data Models
### Product
- id, title, description, price
- category, brand (FitsNew/FitsAgain)
- sizes (array), images (array)
- stock, isFeatured, isTrending

### Admin
- id, email, password (hashed)

### CartItem (LocalStorage)
- productId, title, price, size, quantity, image

## Design System
- **Colors**: Clean neutrals with blue primary accent
- **Typography**: Inter (body), Space Grotesk (display)
- **Spacing**: Consistent 4/6/8/12/16/24 scale
- **Components**: Shadcn UI with custom theming
- **Interactions**: Subtle hover elevations, smooth transitions

## API Endpoints
- `GET /api/products` - List all products
- `GET /api/products/featured` - Featured products
- `GET /api/products/trending` - Trending products
- `GET /api/products/:id` - Single product
- `POST /api/products` - Create product (admin)
- `PATCH /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/admin/login` - Admin authentication

## Environment
- WhatsApp Number: +918606721229
- Admin authentication via JWT tokens
- Cart stored in browser LocalStorage

## Admin Credentials
- Email: admin@fitsnew.com
- Password: admin123

## Recent Changes
- Implemented complete frontend with all pages and components
- Added design guidelines and token system
- Configured routing with wouter
- Created WhatsApp message generation utilities
- Built cart management with LocalStorage
- Designed admin dashboard UI
