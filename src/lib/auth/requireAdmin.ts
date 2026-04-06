import { getCurrentUserRole } from '@/lib/auth/getCurrentUserRole'

export async function requireAdmin() {
  const result = await getCurrentUserRole()

  if (!result.success) {
    return {
      success: false,
      statusCode: result.statusCode,
      message: result.message,
    }
  }

  if (result.role !== 'admin') {
    return {
      success: false,
      statusCode: 403,
      message: 'Forbidden',
    }
  }

  return {
    success: true,
    user: result.user,
    role: result.role,
  }
}