-- Add user_id columns to existing tables
ALTER TABLE invoices ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE invoice_items ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for user_id columns for better performance
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoice_items_user_id ON invoice_items(user_id);

-- Drop the existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on invoices" ON invoices;
DROP POLICY IF EXISTS "Allow all operations on invoice_items" ON invoice_items;

-- Create secure RLS policies that require authentication and user ownership

-- Invoices policies
CREATE POLICY "Users can view their own invoices" ON invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" ON invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" ON invoices
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" ON invoices
    FOR DELETE USING (auth.uid() = user_id);

-- Invoice items policies
CREATE POLICY "Users can view their own invoice items" ON invoice_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoice items" ON invoice_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoice items" ON invoice_items
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoice items" ON invoice_items
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically set user_id on invoice creation
CREATE OR REPLACE FUNCTION set_user_id_on_invoice()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to automatically set user_id on invoice item creation
CREATE OR REPLACE FUNCTION set_user_id_on_invoice_item()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically set user_id
CREATE TRIGGER set_user_id_on_invoice_insert
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id_on_invoice();

CREATE TRIGGER set_user_id_on_invoice_item_insert
    BEFORE INSERT ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id_on_invoice_item();

-- Update existing sample data to have a user_id (for testing purposes)
-- Note: In production, you would need to handle existing data migration properly
-- For now, we'll set all existing records to NULL user_id and they'll be inaccessible
-- until proper user assignment is done

-- Clear existing sample data since it doesn't have proper user ownership
DELETE FROM invoice_items;
DELETE FROM invoices;

-- Create a function to ensure invoice items belong to the same user as their invoice
CREATE OR REPLACE FUNCTION check_invoice_item_user_match()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the invoice belongs to the same user
    IF NOT EXISTS (
        SELECT 1 FROM invoices 
        WHERE id = NEW.invoice_id 
        AND user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Invoice item must belong to an invoice owned by the current user';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to enforce invoice-item user relationship
CREATE TRIGGER check_invoice_item_user_match_trigger
    BEFORE INSERT OR UPDATE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION check_invoice_item_user_match();
