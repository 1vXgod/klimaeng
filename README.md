# KlimaENG v2

Rindërtim i plotë i faqes së KlimaENG — klimatizim, ngrohje dhe HVAC premium në
Prishtinë. Next.js App Router, dizajn i punuar me dorë, panel administrimi dhe
llogari klienti.

## Stack-u

| Shtresa | Teknologjia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Server Components) |
| Gjuha | TypeScript |
| Stilimi | Tailwind CSS v4 (design tokens + dark mode me klasë) |
| Animacionet | Framer Motion |
| Databaza | Prisma + SQLite (dev) |
| Autentikimi | NextAuth v5 (credentials, JWT, role ADMIN/CUSTOMER) |
| State (klient) | Zustand me persist (shporta, dëshirat, krahasimi) |
| Grafikët | Recharts |

## Nisja lokale

```bash
npm install
npx prisma db push   # krijon dev.db
npm run db:seed      # mbush me produkte, porosi, klientë demo
npm run dev
```

### Llogaritë demo

| Roli | Email | Fjalëkalimi |
|---|---|---|
| Admin | admin@klimaeng.com | `Admin123!` |
| Klient | demo@klimaeng.com | `Demo123!` |

## Struktura kryesore

- `src/app/(site)` — faqet publike (ballina, produktet, shërbimet, kontakti…) + llogaria e klientit (`/llogaria`)
- `src/app/(auth)` — kyçja, regjistrimi, rivendosja e fjalëkalimit
- `src/app/admin` — paneli i administrimit (dashboard me grafikë, porositë, produktet CRUD me bulk actions, klientët, mesazhet, aktiviteti, cilësimet)
- `src/app/actions` — server actions (porositë, kontakti, llogaria, admin)
- `src/components/renders` — renderat SVG të produkteve (pa asnjë imazh të jashtëm)
- `src/components/chat` — asistenti + shtresa modulare e live chat-it
- `prisma/seed.ts` — të dhënat demo (rikthehen me `npm run db:seed`)

## Live Chat (modular)

Si parazgjedhje punon **Asistenti KlimaENG** (rule-based, pa kosto, njeh
katalogun dhe llogarit BTU). Për të kaluar në **3CX Live Chat** mjafton `.env`:

```env
NEXT_PUBLIC_CHAT_PROVIDER="3cx"
NEXT_PUBLIC_3CX_CHAT_URL="https://instanca-juaj.3cx.eu"
```

Çdo provajder tjetër shtohet me një komponent të vetëm në
`src/components/chat/ChatWidget.tsx`.

## Email-et (verifikimi, rivendosja, faturat)

Aplikacioni dërgon tre lloje email-esh: kod verifikimi 6-shifror në regjistrim,
kod për rivendosjen e fjalëkalimit, dhe faturë automatike pas çdo porosie
(me produktet, kodet dhe numrin e porosisë).

- **Pa konfigurim** punon në *modalitet demo*: kodet shfaqen direkt në ekran
  dhe email-et logohen në konsolën e serverit — asgjë nuk humbet gjatë zhvillimit.
- **Për dërgim real** mjafton një çelës [Resend](https://resend.com) në `.env`:

```env
RESEND_API_KEY="re_..."
EMAIL_FROM="KlimaENG <info@klimaeng.com>"  # domain i verifikuar në Resend
```

Shabllonet janë te `src/lib/email-templates.ts`, dërguesi te `src/lib/mail.ts`.

## Shënime për prodhim

- **Databaza:** projekti tani punon me **Neon PostgreSQL** (`DATABASE_URL` në `.env`).
  Skema lokale SQLite (`prisma/schema.sqlite.prisma`) ruhet vetëm si referencë e migrimit.
- **Ngarkimi i imazheve:** `/api/upload` ruan në `public/uploads` — në
  serverless kjo është efemere; lidhni S3/Vercel Blob për prodhim (kontrata
  `POST → { url }` mbetet e njëjta).
- **AUTH_SECRET:** gjenerojeni të riun për prodhim (`openssl rand -base64 32`).
