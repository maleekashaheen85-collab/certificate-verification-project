# Phase III — Backend API (Node.js/Express)

> Simple learning backend to pair with the Phase II frontend.  
> Data is stored in a local JSON file (`data/db.json`) for simplicity.

## Run
```bash
npm install
npm run start   # http://localhost:4000/
# or: npm run dev
```

## Endpoints
- `GET /health` → health check
- `GET /certificates` → list all certificates
- `GET /certificates/:id` → get certificate by ID
- `POST /certificates` → create certificate (id, holder, program, issueDate, hash)
- `POST /verify` → verify by `{ id? | hash? }`

> Notes: This is a simple mock. Replace JSON with a real DB later. For Web3, add an endpoint to anchor the hash on-chain via `ethers.js`.
