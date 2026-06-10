import { NextRequest } from 'next/server';
import { validateTelegramInitData } from '@/lib/telegram';

export interface ResolvedUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

// Resolve the Telegram user from a request, reusing the same dev bypass as
// the auth route. initData is taken from the X-Telegram-Init-Data header or
// (optionally) from the request body.
export function resolveUser(request: NextRequest, initDataFromBody?: string): ResolvedUser | null {
  const initData =
    initDataFromBody || request.headers.get('x-telegram-init-data') || '';

  if (!initData) return null;

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev && initData === 'mock_init_data') {
    return {
      id: 123456789,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      language_code: 'ru',
    };
  }

  const validated = validateTelegramInitData(initData);
  if (!validated || !validated.user) return null;
  return validated.user as ResolvedUser;
}
