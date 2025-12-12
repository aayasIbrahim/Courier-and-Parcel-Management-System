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

app/
│
├── dashboard/
│   ├── admin/
│   │   ├── layout.tsx               # Admin layout (uses reusable Layout component)
│   │   ├── page.tsx                 # Admin dashboard home
│   │   ├── parcels/
│   │   │   ├── page.tsx             # All parcels
│   │   │   ├── pending/page.tsx
│   │   │   ├── delivered/page.tsx
│   │   │   ├── failed/page.tsx
│   │   │   └── [id]/page.tsx        # Parcel details
│   │   ├── assign/page.tsx          # Assign agent page
│   │   ├── users/
│   │   │   ├── page.tsx             # All users
│   │   │   ├── agents/page.tsx
│   │   │   └── customers/page.tsx
│   │   ├── reports/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── agent/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Assigned parcels
│   │   ├── status/
│   │   │   ├── picked/page.tsx
│   │   │   ├── transit/page.tsx
│   │   │   ├── delivered/page.tsx
│   │   │   └── failed/page.tsx
│   │   ├── route/page.tsx           # Route optimization map
│   │   └── profile/page.tsx
│   │
│   └── customer/
│       ├── layout.tsx
│       ├── page.tsx                 # Home
│       ├── book/page.tsx            # Parcel booking
│       ├── history/page.tsx         # Booking history
│       ├── track/
│       │   └── [id]/page.tsx        # Parcel tracking map
│       └── profile/page.tsx
│
├── api/
│   ├── auth/                        # NextAuth routes
│   ├── parcels/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── users/
│       ├── route.ts
│       └── [id]/route.ts
│
├── components/
│   ├── ui/
│   │   ├── Layout.tsx                # Reusable layout (Navbar + Sidebar)
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── admin/
│   │   ├── MetricCard.tsx
│   │   ├── ParcelTable.tsx
│   │   └── UserTable.tsx
│   │
│   ├── agent/
│   │   ├── ParcelTable.tsx
│   │   └── ParcelMap.tsx
│   │
│   └── customer/
│       ├── BookingForm.tsx
│       ├── BookingTable.tsx
│       └── ParcelMap.tsx
│
├── lib/
│   ├── db.ts                         # MongoDB connection
│   ├── utils.ts                      # Utility functions like 'cn'
│   └── api/                          # RTK Query API slices
│       ├── parcels.ts
│       └── users.ts
│
├── models/
│   ├── User.ts
│   ├── Parcel.ts
│   └── Tracking.ts
│
├── styles/
│   └── globals.css
│
├── env.d.ts
├── next-env.d.ts
└── next.config.js

