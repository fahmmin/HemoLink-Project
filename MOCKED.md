# What Is Mocked or Local (HemoLink)

This is a **testing / non-production** setup. The following are **mocked** or **local** so you don’t need cloud APIs or heavy services.

---

## Mocked (not real implementation)

| Item | What we do instead | If you want real |
|------|--------------------|-------------------|
| **ML matching model** | Simple weighted rules in `backend/src/utils/eligibility.js` (score from days since donation, distance, availability, health flags). No Logistic Regression / Random Forest. | Add a small Python service with scikit-learn LR/RF and call it from Express. |
| **NLP (health normalization)** | **Minimal:** Keyword/synonym matching in `backend/src/utils/healthNlp.js` – free text is normalized to flags (e.g. ill/sick/fever → recent_illness; diabetes/sugar → diabetes; anemia, bp, medication). No spell correction or NLTK. | Add NLTK/spaCy or a spell-check library for richer normalization. |
| **OCR (blood requisition form)** | **Minimal:** Frontend uses **Tesseract.js** (browser). "Scan requisition" on Request blood page uploads an image, runs OCR, parses text for blood group (A+/B+/etc.) and hospital name, prefills the form. No backend upload. | Server-side Tesseract for higher accuracy or PDF support. |
| **Maps** | **Leaflet + OpenStreetMap** – no API key. Click map (India bounds) to set lat/lng; distance still computed locally (Haversine). | Google Maps / Mapbox for richer tiles or geocoding. |

---

## Local (no cloud)

| Item | Implementation |
|------|----------------|
| **Distance** | **Haversine** in `backend/src/utils/geo.js` – distance in km between (lat, lng) and (lat, lng). No API key. |
| **Database** | **MongoDB** – run locally (`mongod` or Docker). Tests use `mongodb-memory-server`. |
| **Auth** | **JWT** in Node; secret from `.env`. No OAuth or cloud auth. |
| **Frontend API** | Vite proxy sends `/api` to `http://localhost:5000`. No serverless or cloud gateway. |

---

## Summary

- **Mapped:** Geospatial search uses **Haversine** (local). Donors are filtered by blood group, availability, and distance; then ranked by the **mock** eligibility score and **mock** XAI reasons.
- **Minimal NLP:** Health summary → flags via keyword rules; **minimal OCR:** Tesseract.js in browser to prefill request form from a requisition image.
