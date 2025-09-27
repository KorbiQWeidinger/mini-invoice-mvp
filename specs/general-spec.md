# Mini-Rechnungs-MVP Specification

## Project Overview

**Project Name:** Mini-Rechnungs-MVP  
**Description:** A minimal viable product for invoice management with real-time preview and CRUD operations  
**Target:** Quick, modern, and responsive invoice management solution

## Core Features

### 1. Real-time Invoice Preview

- **Live HTML Preview**: Real-time rendering of invoice as user types/edits
- **Instant Updates**: Changes reflect immediately in preview pane
- **Responsive Design**: Preview adapts to different screen sizes
- **Print-ready Format**: Preview matches final invoice output

### 2. CRUD Operations with DataTable

- **Create**: Add new invoices with form validation
- **Read**: View invoice list with search and filtering
- **Update**: Edit existing invoices inline or via modal
- **Delete**: Remove invoices with confirmation dialog
- **Search**: Real-time search across invoice fields
- **Sorting**: Sort by date, amount, customer, status
- **Pagination**: Handle large datasets efficiently

## Technical Stack

### Frontend Framework

- **Next.js+**: React framework with App Router
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework

### UI Components

- **Preline.co**: Modern UI component library
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching capability

### Backend & Database

- **Supabase**:
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication (if needed)
  - Row Level Security (RLS)
  - API auto-generation

### State Management

- **React Query/TanStack Query**: Server state management
- **Zustand**: Client state management (lightweight)
- **React Hook Form**: Form handling and validation

## Database Schema

### Invoices Table

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_address TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Invoice Items Table

```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## User Interface Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo | Navigation | Theme Toggle | User Menu    │
├─────────────────────────────────────────────────────────┤
│ Main Content Area                                        │
│ ┌─────────────────┬─────────────────────────────────────┐ │
│ │ Invoice List    │ Invoice Form & Preview              │ │
│ │ (DataTable)     │ ┌─────────────────┬─────────────────┐ │ │
│ │                 │ │ Form Fields     │ Live Preview     │ │ │
│ │ - Search        │ │                 │                 │ │ │
│ │ - Filter        │ │ - Customer Info │ - Invoice HTML  │ │ │
│ │ - Sort          │ │ - Items         │ - Print Ready    │ │ │
│ │ - Pagination    │ │ - Totals        │                 │ │ │
│ │                 │ └─────────────────┴─────────────────┘ │ │
│ └─────────────────┴─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Key Pages/Components

#### 1. Dashboard/Invoice List

- **DataTable Component**:
  - Columns: Invoice #, Customer, Date, Amount, Status, Actions
  - Search bar with real-time filtering
  - Status filter dropdown
  - Date range picker
  - Export functionality (PDF, CSV)

#### 2. Invoice Form

- **Customer Section**:
  - Name (required)
  - Email
  - Address (multi-line)
- **Invoice Details**:
  - Invoice number (auto-generated)
  - Issue date
  - Due date
- **Items Section**:
  - Dynamic item rows
  - Description, Quantity, Unit Price
  - Add/Remove item buttons
  - Auto-calculate line totals
- **Totals Section**:
  - Subtotal (auto-calculated)
  - Tax rate input
  - Tax amount (auto-calculated)
  - Total amount (auto-calculated)

#### 3. Live Preview Component

- **Real-time Updates**: Syncs with form changes
- **Print Styles**: Optimized for A4 printing
- **Responsive**: Adapts to container size
- **Template**: Professional invoice layout

## API Endpoints

### Invoice Management

```
GET    /api/invoices              # List invoices with pagination/filtering
POST   /api/invoices              # Create new invoice
GET    /api/invoices/[id]         # Get single invoice
PUT    /api/invoices/[id]         # Update invoice
DELETE /api/invoices/[id]         # Delete invoice
```

### Invoice Items

```
GET    /api/invoices/[id]/items   # Get invoice items
POST   /api/invoices/[id]/items   # Add item to invoice
PUT    /api/invoices/[id]/items/[itemId]  # Update item
DELETE /api/invoices/[id]/items/[itemId] # Delete item
```

## Development Phases

### Phase 1: Core Setup (Week 1)

- [ ] Next.js project initialization
- [ ] Supabase setup and configuration
- [ ] Database schema creation
- [ ] Basic routing structure
- [ ] Preline.co integration

### Phase 2: Invoice CRUD (Week 2)

- [ ] Invoice list with DataTable
- [ ] Create invoice form
- [ ] Edit invoice functionality
- [ ] Delete invoice with confirmation
- [ ] Search and filtering

### Phase 3: Real-time Preview (Week 3)

- [ ] Live preview component
- [ ] Form-to-preview synchronization
- [ ] Print-ready styling
- [ ] Responsive preview layout

### Phase 4: Polish & Testing (Week 4)

- [ ] Form validation improvements
- [ ] Error handling
- [ ] Loading states
- [ ] Performance optimization
- [ ] Testing and bug fixes

## Technical Requirements

### Performance

- **Page Load**: < 2 seconds initial load
- **Real-time Updates**: < 100ms preview update delay
- **Search**: < 300ms search response time
- **Database**: Optimized queries with proper indexing

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Responsive Breakpoints

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## Security Considerations

### Data Protection

- Input validation and sanitization
- SQL injection prevention (Supabase handles this)
- XSS protection
- CSRF protection

### Access Control

- Row Level Security (RLS) in Supabase
- API rate limiting
- Secure environment variables

## Deployment

### Environment Setup

- **Development**: Local development with Supabase local instance
- **Staging**: Vercel preview deployments
- **Production**: Vercel with Supabase production database

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Success Metrics

### User Experience

- Time to create first invoice: < 2 minutes
- Preview update responsiveness: < 100ms
- Search result accuracy: > 95%

### Technical Performance

- Page load time: < 2 seconds
- Database query time: < 200ms
- Uptime: > 99.5%

## Future Enhancements (Post-MVP)

### Additional Features

- Invoice templates
- Customer management
- Payment tracking
- Email sending
- PDF generation
- Multi-language support
- Advanced reporting
- API for third-party integrations

### Scalability Considerations

- Database optimization
- Caching strategies
- CDN integration
- Microservices architecture (if needed)

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 1 month]
