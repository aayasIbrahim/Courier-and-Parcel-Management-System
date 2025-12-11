# Courier & Parcel Management System

A full-stack courier & parcel management system built with Next.js, NextAuth, MongoDB, and Socket.IO.  
It supports multiple user roles (admin, delivery agent, customer), parcel booking, real-time status tracking, and tracking history.

## 🧰 Tech Stack

- Frontend & Backend: Next.js (App Router) + TypeScript  
- Database: MongoDB + Mongoose  
- Authentication: NextAuth (Credentials + JWT)  
- Real-time: Socket.IO  
- State management / API: RTK Query (Redux Toolkit)  
- Styling: Tailwind CSS (or your preferred UI library)  

## 📁 Folder Structure

your-project/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts        # NextAuth login/logout
│   │   ├── auth/
│   │   │   └── register/route.ts             # User registration
│   │   ├── parcels/
│   │   │   ├── route.ts                       # GET all, POST create parcel
│   │   │   └── [id]/route.ts                 # GET, PATCH, DELETE parcel
│   │   ├── tracking/
│   │   │   └── [parcelId]/route.ts           # Track parcel history CRUD
│   │   ├── agents/
│   │   │   └── assign/route.ts               # Assign parcel to agent
│   │   └── users/
│   │       ├── route.ts                       # Admin: view all users
│   │       └── [id]/route.ts                 # Admin: single user CRUD
│   │
│   ├── dashboard/
│   │   ├── admin/page.tsx                     # Admin dashboard
│   │   ├── agent/page.tsx                     # Agent dashboard
│   │   └── customer/page.tsx                  # Customer dashboard
│   │
│   ├── login/page.tsx                          # Login page
│   ├── register/page.tsx                       # Registration page
│   ├── parcels/
│   │   └── create/page.tsx                     # Parcel booking form
│   ├── layout.tsx                              # App layout (Header + Sidebar)
│   └── page.tsx                                # Landing page / Home
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── cards/
│   │   └── MetricCard.tsx
│   ├── tables/
│   │   ├── ParcelTable.tsx
│   │   ├── UsersTable.tsx
│   │   └── TrackingTable.tsx
│   ├── maps/
│   │   └── ParcelMap.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
│
├── models/
│   ├── User.ts
│   ├── Parcel.ts
│   └── Tracking.ts
│
├── lib/
│   ├── connectDB.ts                            # MongoDB connection
│   ├── authOptions.ts                           # NextAuth options
│   └── verifyRole.ts                            # Role-based access middleware
│
├── redux/
│   ├── store.ts
│   ├── slices/
│   │   ├── parcelSlice.ts
│   │   └── trackingSlice.ts
│   └── api/
│       └── parcelApi.ts                        # RTK Query endpoints
│
├── middleware.ts                                # Protect routes / role-based
├── utils/
│   ├── constants.ts
│   └── helpers.ts
├── public/
│   └── assets/                                 # Images, icons, logos
├── .env
├── package.json
└── tailwind.config.js
