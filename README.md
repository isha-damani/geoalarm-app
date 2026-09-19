# GeoAlarm

A location-based alarm app that tracks your live position and wakes you up (via an in-app alarm) when you arrive at or cross a location you've set — built for situations like napping on a bus/train without missing your stop.

**Status: in progress.** This README reflects what's currently built and what's planned next.

## Problem it solves

Falling asleep on public transit and missing your stop is a common, small-but-real problem. Rather than relying on manually setting timers or staying awake, this app lets you set a destination and radius in advance, then alerts you automatically when you're close — using live geolocation tracking in the background.

## Tech stack

- **Backend:** Node.js + Express
- **Database:** MongoDB (via MongoDB Atlas), using Mongoose as the ODM
- **Auth:** JWT-based authentication, passwords hashed with bcryptjs
- **Frontend:** React (via Vite), React Router for navigation, axios for API calls

MERN was chosen to reuse a single JavaScript-based stack across the whole app, and MongoDB's native geospatial support (`2dsphere` indexes, GeoJSON) fits the location-based nature of the problem directly, rather than bolting geo-queries onto a relational schema.

## Current progress

**Built:**
- Express server connected to MongoDB Atlas
- Data models: `User`, `Location`, `AlarmLog` (with a `2dsphere` index on `Location.coordinates` for efficient proximity queries)
- Auth routes: `POST /api/auth/signup` and `POST /api/auth/login`, with hashed passwords and JWT issuance
- JWT auth middleware protecting private routes, attaching the logged-in user to `req.user`
- Location CRUD: create, list (scoped to the logged-in user), and delete, all ownership-checked so users can only access their own locations
- AlarmLog routes: create on trigger, list history, mark acknowledged (PATCH), all ownership-checked (including verifying the referenced location belongs to the requesting user)
- Tested end-to-end with Thunder Client, including negative cases (missing/invalid token, deleting another user's location)
- Frontend: signup and login pages with controlled forms, calling the backend over axios (CORS configured on the backend to allow this)
- JWT stored in `localStorage` after login; redirects to the dashboard on login and to the login page after signup
- `ProtectedRoute` wrapper component guarding the dashboard route, redirecting logged-out users to `/login`
- Dashboard: fetches, displays, creates, and deletes the logged-in user's saved locations — list updates immediately on add/delete, no reload needed
- Interactive map (Leaflet + react-leaflet) on the Dashboard: click to pick a location for the add-location form, with a marker showing the selection and a coordinate readout; click the marker again to deselect
- Live geolocation tracking via the browser's Geolocation API (`watchPosition`), shown as a distinct red marker on the map, separate from the location-picker marker

**Planned next:**
- Location edit (PATCH) route
- Distance-based alarm triggering: compare live position against saved locations/radii, trigger an alarm and log it via the AlarmLog routes
- Alarm history view on the frontend
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

**Backend**
1. Navigate to `/server`
2. Run `npm install`
3. Create a `.env` file in `/server` with:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=3000
   JWT_SECRET=your_secret_key
   ```
4. Run `node server.js` — runs on `http://localhost:3000` (or your configured `PORT`)

**Frontend**
1. Navigate to `/client`
2. Run `npm install`
3. Run `npm run dev` — runs on `http://localhost:5173`

### API endpoints (so far)

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create a new user account |
| POST | `/api/auth/login` | No | Log in and receive a JWT |
| POST | `/api/locations` | Yes | Create a new saved location (name, radius, coordinates) |
| GET | `/api/locations` | Yes | List all locations owned by the logged-in user |
| DELETE | `/api/locations/:id` | Yes | Delete a location (only if owned by the logged-in user) |
| POST | `/api/alarmLogs` | Yes | Create an alarm log entry for a location you own |
| GET | `/api/alarmLogs` | Yes | List all alarm logs owned by the logged-in user |
| PATCH | `/api/alarmLogs/:id` | Yes | Mark an alarm log as acknowledged |

Protected routes expect a header: `Authorization: Bearer <token>`