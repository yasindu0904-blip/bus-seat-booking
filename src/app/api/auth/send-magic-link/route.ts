import { sendMagicLinkController } from '@/lib/controllers/auth/send-magic-link.controller'

export async function POST(request: Request) {
  return sendMagicLinkController(request)
}