# HemoLink – Blood Donor Discovery (MERN, TDD, Neobrutalism)

Centralized web app to connect blood donors with people in urgent need. Location-based search, SOS requests, eligibility scoring, and Explainable AI (XAI) reasons. Built in a **test-driven** way with **local/mocked** services and **vibrant neobrutalism** UI.

## Quick start

1. **MongoDB** – Run locally (e.g. `mongod` or Docker):
   ```bash
   # Example: Docker
   docker run -d -p 27017:27017 --name hemolink-mongo mongo:7
   ```

2. **Backend**
   ```bash
   cd backend
   cp .env.example .env   # edit if needed
   npm install
   npm test               # TDD: run tests
   npm run dev            # http://localhost:5000
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm test               # component tests
   npm run dev            # http://localhost:5173 (proxies /api to backend)
   ```

4. **Map:** Location picker uses **Leaflet + OpenStreetMap** (no API key). Click the map to set lat/lng; manual fields available too.

5. Open **http://localhost:5173** – Register as donor or seeker, set location (map or manual), then use **Emergency SOS** with **radius dropdown** (5–100 km) to find donors.

## Tech stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT auth, Jest + Supertest
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Vitest + React Testing Library
- **Design**: Vibrant neobrutalism (bold borders, bright colors, chunky shadows)

## What’s local vs mocked

See **[MOCKED.md](MOCKED.md)** for a clear list of what is **mocked** or **local** (no cloud APIs). Summary:

- **Maps / geo**: Local **Haversine** distance (no Google Maps API).
- **ML / eligibility**: **Mock** scoring and XAI reasons in Node (no Python, no real model).
- **NLP / OCR**: **Mocked** (no Tesseract/NLTK); health text stored as-is; no OCR form scan.
- **DB**: Local **MongoDB** (or in-memory for tests).

## Tests (TDD)

- **Backend**: `cd backend && npm test` – unit tests for `geo`, `eligibility`; integration tests for auth, donors, requests (using `mongodb-memory-server`).
- **Frontend**: `cd frontend && npm test` – component tests for `EligibilityGauge`, `XAIReasons`.

## Project layout

```
akil/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── models/      (User, Donor, BloodRequest)
│   │   ├── routes/      (auth, donors, requests)
│   │   ├── middleware/  (auth)
│   │   ├── utils/       (geo.js, eligibility.js – local/mock)
│   │   └── __tests__/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/   (Layout, EligibilityGauge, XAIReasons)
│   │   ├── pages/       (Home, Login, Register, DonorDashboard, RequestBlood)
│   │   └── test/
│   └── package.json
├── README.md
└── MOCKED.md
```

## Design (Neobrutalism)

- Bold black borders (2–4px), bright flat colors (yellow, cyan, pink, green, red, purple).
- Chunky shadows (e.g. 4px 4px 0 black), no rounded corners on main elements.
- Font: Space Grotesk; mobile-first layout.
