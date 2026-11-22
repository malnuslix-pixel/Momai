# Mwalimu Family — Full-Stack Next.js Application with Supabase

A unified, production-grade Next.js web application combining the **Mwalimu Family Public Educational Portal** and the **Control Room Admin Dashboard**, backed by **Supabase**.

Strictly preserves 100% of the bespoke design, responsive styling, interactive calculators, and Kenyan curriculum tools.

---

## 🌟 Key Features

### 1. Public Educational Portal (`/`)
- **Kenya's School News & Editorial Desk:** Daily reporting, official MoE/KNEC updates, results season guides.
- **Audience-Based Experience:** Fast access for Teachers, Parents, and Learners.
- **Interactive Kenyan Curriculum Calculators:**
  - **KCSE Mean Grade & Points Calculator:** 7 best subjects formula (maximum 84 points).
  - **KJSEA CBE Grade 9 Points Calculator:** 8 performance levels (EE1 to BE2) across 9 learning areas (maximum 72 points).
  - **KUCCPS Weighted Cluster Points Calculator:** Official formula $\sqrt{(r/48) \times (t/84)} \times 48$.
  - **Secondary School Fees Planner:** Termly public tuition & county bursary budget estimator.
  - **Scheme of Work & Lesson Plan Generator:** Instant classroom-ready printable lesson documents.
- **Interactive Learning & Revision:** CBC glossary, flashcards, interactive quizzes, digital skill courses.
- **Filterable Jobs & Notice Board:** Real-time listings loaded from Supabase backend.
- **Online Submission Forms:** Tutor requests, tutor applications, job postings, advertising quotes, official notices.
- **Newsletter Subscription:** Instant sign-up connected to Supabase.
- **"Ask Mwalimu" Interactive Educational Assistant:** Warm Kenyan education guidance for CBE, KCSE, KJSEA, and KUCCPS.
- **Installable PWA:** Offline-capable service worker, manifest, and icons.

### 2. Control Room Dashboard (`/control-room`)
- **Overview:** 10 core KPIs, 14-day visitor traffic SVG chart, Results season status, SLA alerts.
- **Content:** Full CRUD management for jobs and official notices, with status dropdowns (`draft`, `published`, `rejected`), expiry date selectors, and live `feed.json` export.
- **Inbox:** Submission verification desk enforcing the strict **3-point editorial checklist** before approval; approved items automatically convert into drafts in Content.
- **Audience:** Visitor acquisition channels, device breakdown, top pages, subscribers growth chart, top Kenyan counties.
- **Assistant:** AI query volume, latency tracking, fallback rates, topic breakdown, and question log.
- **Health & Checks:** 9 accuracy checks covering syllabus bands, cluster formulas, and link resolution with one-click verification.
- **Site Flags:** Live toggles for Maintenance mode, Scam alert banner, Lite mode, AI Assistant, Submission forms, and Emergency banner editor.
- **Operations:** Live audit log and Supabase connection monitor.

### 3. Auxiliary Pages
- `/privacy` — Kenyan Data Protection Act compliant privacy notice.
- `/offline` — PWA offline fallback screen.

---

## 🚀 Supabase Backend Architecture

### Tables Created
1. `public.items`: Published and draft jobs and official notices.
2. `public.submissions`: Inbound form submissions with 3-point checklist state.
3. `public.subscribers`: Newsletter and WhatsApp channel subscribers.
4. `public.assistant_logs`: "Ask Mwalimu" queries, answers, and model telemetry.
5. `public.site_config`: Feature flags and emergency banners.
6. `public.audit_log`: System activity records and administrative actions.
7. `public.verification_checks`: Editorial accuracy and syllabus verification records.

### Database Migration
The complete SQL schema with RLS policies and seed data is in:
```
supabase/schema.sql
```
To initialize in Supabase:
1. Open your Supabase project dashboard.
2. Go to the **SQL Editor**.
3. Paste the contents of `supabase/schema.sql` and click **Run**.

---

## 💻 Getting Started

### 1. Environment Variables
Create or verify `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SECRET_KEY=Mwalimu@2026!
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the public portal, and [http://localhost:3000/control-room](http://localhost:3000/control-room) for the Control Room.

### 3. Production Build & Start
```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy
- Zero personal identification numbers or exam indices requested or logged.
- Honeypot spam filtering active on all forms.
- Supabase Row Level Security (RLS) protects admin endpoints.
