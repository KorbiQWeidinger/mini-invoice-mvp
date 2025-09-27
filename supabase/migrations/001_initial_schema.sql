-- Create invoices table
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

-- Create invoice_items table
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_invoices_customer_name ON invoices(customer_name);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for MVP - in production you'd want proper auth)
CREATE POLICY "Allow all operations on invoices" ON invoices
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on invoice_items" ON invoice_items
    FOR ALL USING (true);

-- Insert some sample data for testing
INSERT INTO invoices (invoice_number, customer_name, customer_email, customer_address, issue_date, due_date, status, subtotal, tax_rate, tax_amount, total_amount, notes) VALUES
('INV-001', 'Acme Corporation', 'billing@acme.com', '123 Business St, City, State 12345', '2024-01-15', '2024-02-15', 'sent', 1000.00, 10.00, 100.00, 1100.00, 'Thank you for your business!'),
('INV-002', 'Tech Solutions Ltd', 'accounts@techsolutions.com', '456 Tech Ave, Innovation City, IC 67890', '2024-01-16', '2024-02-16', 'draft', 2500.00, 8.50, 212.50, 2712.50, 'Monthly service fee'),
('INV-003', 'Creative Agency', 'finance@creative.com', '789 Design Blvd, Creative District, CD 54321', '2024-01-17', '2024-02-17', 'paid', 750.00, 12.00, 90.00, 840.00, 'Web design project');

-- Insert sample invoice items
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, line_total) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-001'), 'Web Development Services', 40.00, 25.00, 1000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-002'), 'Cloud Hosting - Premium Plan', 1.00, 500.00, 500.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-002'), 'Database Management', 1.00, 2000.00, 2000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-003'), 'Logo Design', 1.00, 500.00, 500.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-003'), 'Brand Guidelines', 1.00, 250.00, 250.00);
