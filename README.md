# Reclaim

A modern Lost & Found platform built to simplify how students report, search, and recover lost belongings on campus.

Instead of relying on scattered WhatsApp messages, notice boards, or word of mouth, Reclaim provides a single place where lost and found items can be reported, searched, and managed.

---

## Features

### Current

- Report lost and found items
- Browse recent reports
- Search and filter listings
- View detailed item information
- Track item status
- Responsive interface for desktop and mobile

### Planned

- Smart match suggestions
- Proof of ownership verification
- QR code support for personal belongings
- Progressive Web App (PWA)

---

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend

- Supabase
  - PostgreSQL
  - Storage

---

## Project Structure

```text
src/
├── components/
├── data/
├── lib/
└── pages/

docs/
└── wireframes.md

supabase/
└── schema.sql
```

---

## Getting Started

Clone the repository.

```bash
git clone https://github.com/<username>/reclaim.git
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
Copy the example environment file.

```bash
cp .env.example .env
```

Then fill in your Supabase credentials.

Start the development server.

```bash
npm run dev
```

---

## Motivation

Losing an item on campus often means checking multiple WhatsApp groups, asking friends, or hoping someone notices a paper notice board.

Reclaim aims to make this process simple by providing a centralized platform where students can quickly report lost or found items and easily search existing reports.

---

## Roadmap

- [ ] Lost & Found reporting
- [ ] Search and filtering
- [ ] Item details
- [ ] Smart matching
- [ ] Proof of ownership
- [ ] QR code generation
- [ ] PWA support

---

## License

This project is licensed under the MIT License.