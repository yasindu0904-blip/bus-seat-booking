import { NextRequest } from 'next/server'
import { createCustomerProfileController } from '@/lib/controllers/customerProfileController'

export async function POST(request: NextRequest) {
  return createCustomerProfileController(request)
}