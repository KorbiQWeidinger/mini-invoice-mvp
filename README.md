# Mini-Invoice MVP

A minimal viable product for invoice management with real-time preview and CRUD operations.

## Tech Stack

- **Frontend**: Next.js 15.5.4 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Real-time, Auth)
- **State Management**: React Query/TanStack Query, Zustand
- **Forms**: React Hook Form
- **UI Components**: Preline.co

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd mini-invoice-mvp
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Setup

Run the initial migration in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase/migrations/001_initial_schema.sql
```

Or use the Supabase CLI:

```bash
npx supabase init
npx supabase db push
```

### Organizations & Multi-tenant Invoices

Apply migrations in this order inside Supabase SQL editor:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_add_user_authentication.sql`
3. `supabase/migrations/003_organizations.sql`
4. `supabase/migrations/004_invoices_org_id.sql`

Key objects:

- Tables: `organizations`, `organization_members`, `organization_invites`
- RPCs: `create_organization(name, slug, ...)`, `accept_organization_invite(token)`
- Invoices now include `organization_id` and org-based RLS policies.

Runtime behavior:

- Toolbar org switcher sets a cookie used by invoice APIs to scope queries.
- Account page exposes basic org info and a simple invite flow.
- PDF export header shows the organization name.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── lib/                 # Utilities and configurations
│   ├── supabase.ts     # Supabase client
│   ├── supabase-admin.ts # Server-side Supabase client
│   └── database.ts     # Database service functions
├── components/          # React components
└── types/              # TypeScript type definitions

supabase/
└── migrations/         # Database migration files
```

## Features

- ✅ Real-time invoice preview
- ✅ CRUD operations for invoices
- ✅ Invoice items management
- ✅ Search and filtering
- ✅ Responsive design
- ✅ Print-ready invoice format

## Development Phases

- [x] Phase 1: Core Setup (Next.js, Supabase, Database)
- [ ] Phase 2: Invoice CRUD
- [ ] Phase 3: Real-time Preview
- [ ] Phase 4: Polish & Testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
