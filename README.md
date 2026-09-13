# GeoAlarm

A location-based alarm app that tracks your live position and wakes you up (via an in-app alarm) when you arrive at or cross a location you've set — built for situations like napping on a bus/train without missing your stop.

**Status: in progress.** This README reflects what's currently built and what's planned next.

## Problem it solves

Falling asleep on public transit and missing your stop is a common, small-but-real problem. Rather than relying on manually setting timers or staying awake, this app lets you set a destination and radius in advance, then alerts you automatically when you're close — using live geolocation tracking in the background.

## Tech stack

- **Backend:** Node.js + Express
- **Database:** MongoDB (via MongoDB Atlas), using Mongoose as the ODM
- **Auth:** JWT-based authentication, passwords hashed with bcryptjs
- **Frontend:** React (planned — not yet built)

MERN was chosen to reuse a single JavaScript-based stack across the whole app, and MongoDB's native geospatial support (`2dsphere` indexes, GeoJSON) fits the location-based nature of the problem directly, rather than bolting geo-queries onto a relational schema.

## Current progress

**Built:**
- Express server connected to MongoDB Atlas
- Data models: `User`, `Location`, `AlarmLog` (with a `2dsphere` index on `Location.coordinates` for efficient proximity queries)
- Auth routes: `POST /api/auth/signup` and `POST /api/auth/login`, with hashed passwords and JWT issuance
- Tested end-to-end with Thunder Client

**Planned next:**
- Auth middleware to protect routes with JWT verification
- Location CRUD (save, list, edit, delete named locations with radius)
- Frontend: map view, live geolocation tracking, radius selection
- Distance-based alarm triggering and alarm history log
- Scalability pass: geospatial `$near` queries, indexing review

## Data model

**User**
- `email` (unique)
- `passwordHash`
- `createdAt` / `updatedAt`

**Location**
- `name`
- `owner` (ref → User)
- `radius` (meters)
- `coordinates` (GeoJSON `Point`, indexed `2dsphere`)
- `createdAt` / `updatedAt`

**AlarmLog**
- `location` (ref → Location)
- `owner` (ref → User)
- `acknowledged` (boolean, default `false`)
- `createdAt` / `updatedAt`

## Setup

1. Clone the repo and navigate to `/server`
2. Run `npm install`
3. Create a `.env` file in `/server` with:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=3000
   JWT_SECRET=your_secret_key
   ```
4. Run `node server.js`
5. Server runs on `http://localhost:3000` (or your configured `PORT`)

### API endpoints (so far)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create a new user account |
| POST | `/api/auth/login` | Log in and receive a JWT |