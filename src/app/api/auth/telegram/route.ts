import { NextRequest, NextResponse } from 'next/server';
import { validateTelegramInitData } from '@/lib/telegram';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { initData, startParam } = await request.json();

    if (!initData) {
      return NextResponse.json(
        { error: 'Missing initData' },
        { status: 400 }
      );
    }

    // Validate Telegram init data (skip in development)
    const isDev = process.env.NODE_ENV === 'development';
    let telegramUser;

    if (isDev && initData === 'mock_init_data') {
      // Mock user for development
      telegramUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        language_code: 'ru',
      };
    } else {
      const validated = validateTelegramInitData(initData);
      if (!validated || !validated.user) {
        return NextResponse.json(
          { error: 'Invalid initData' },
          { status: 401 }
        );
      }
      telegramUser = validated.user;
    }

    const supabase = createServerClient();

    // Check if user exists
    const { data: existingProfile } = await supabase
      .from('aura_profiles')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .single();

    let profile;

    if (existingProfile) {
      // Update existing user
      const { data: updatedProfile, error: updateError } = await supabase
        .from('aura_profiles')
        .update({
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || null,
          username: telegramUser.username || null,
          language_code: telegramUser.language_code || null,
          is_premium: telegramUser.is_premium || false,
          photo_url: telegramUser.photo_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('telegram_id', telegramUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return NextResponse.json(
          { error: 'Failed to update profile' },
          { status: 500 }
        );
      }

      profile = updatedProfile;
    } else {
      // Create new user
      const { data: newProfile, error: createError } = await supabase
        .from('aura_profiles')
        .insert({
          telegram_id: telegramUser.id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || null,
          username: telegramUser.username || null,
          language_code: telegramUser.language_code || null,
          is_premium: telegramUser.is_premium || false,
          photo_url: telegramUser.photo_url || null,
          credits: 0,
          referral_source: startParam || null,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return NextResponse.json(
          { error: 'Failed to create profile' },
          { status: 500 }
        );
      }

      profile = newProfile;

      // Track new user event
      await supabase.from('aura_user_events').insert({
        telegram_id: telegramUser.id,
        event_type: 'user_registered',
        event_data: {
          referral_source: startParam || null,
        },
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
