import { NextRequest, NextResponse } from 'next/server'
import { invoiceService } from '@/lib/database'

// GET /api/invoices - List all invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    let invoices
    if (query) {
      invoices = await invoiceService.search(query)
    } else {
      invoices = await invoiceService.getAll()
    }
    
    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

// POST /api/invoices - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const invoice = await invoiceService.create(body)
    
    return NextResponse.json({ invoice }, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
