https://youtu.be/4oFA4c3seCc رابط فيديو الشرح على اليوتيوب





# Certificate Verification Platform (Final Submission)


This repository contains **all phases** of the project:
- Phase I — Analysis & sketches (wireframes) *(docs)*
- Phase II — Frontend demo *(static, mock interactions)*
- Phase III — Backend API *(Node/Express, JSON store)*
- Phase IX — Smart Contract *(Solidity on Remix)*
- Final — Documentation, screenshots and video script

## Quick Start

### A) Smart Contract on Remix
1. Open Remix: https://remix.ethereum.org
2. Create file **`CertificateRegistry.sol`** under `smart-contract/` and paste the contents.
3. Compiler: `0.8.20` then **Compile**.
4. Deploy & Run → **Environment = Remix VM (London/Prague)** → **Deploy**.
5. Test:
   - `authorizeIssuer(address,bool)` → authorize another issuer (optional).
   - `issueCertificate(id, hash, meta)` → try: `CERT-2025-00001`, `0x1234...abcd`, `malak — IT — Very Good`.
   - `verifyById("CERT-2025-00001")` → returns `(valid, exists, revoked)`.
   - `revokeCertificate("CERT-2025-00001")` → then verify again.

### B) Frontend (Phase II demo)
Open `frontend/index.html` directly in a browser. It’s a static mock:
- Home, Verify, Issuer, Admin, Login pages.
- Data saved to `localStorage` (no backend).

### C) Backend (optional)
Inside `/backend`:
```bash
npm install
npm start
# API on http://localhost:4000
```
Endpoints: `GET /health`, `POST /verify`, etc. (see **backend/README.md**).

## Project Structure
```
smart-contract/     # Solidity contract (Phase IX)
frontend/           # HTML/CSS/JS demo (Phase II)
backend/            # Node/Express mock API (Phase III)
docs/               # Reports, instructions, scripts
screenshots/        # Key screenshots (Remix + UI)
README.md           # This file
```

## Credits
Built for learning purposes. On-chain logic kept minimal and auditable.
