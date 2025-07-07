import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    const deviceId = request.headers.get('x-device-id')

    if (!userId && !deviceId) {
      return NextResponse.json(
        { error: 'User ID or Device ID required' },
        { status: 400 }
      )
    }

    // First get the user config
    let configQuery = supabase.from('user_configs').select('id')
    if (userId) {
      configQuery = configQuery.eq('user_id', userId)
    } else {
      configQuery = configQuery.eq('device_id', deviceId)
    }

    const { data: config, error: configError } = await configQuery.single()

    if (configError || !config) {
      return NextResponse.json({ reminders: [] })
    }

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select(`
        *,
        events (
          id,
          title,
          start_time,
          sport_id,
          sports (
            name,
            slug
          )
        )
      `)
      .eq('user_config_id', config.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reminders: reminders || [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    const deviceId = request.headers.get('x-device-id')
    const body = await request.json()

    if (!userId && !deviceId) {
      return NextResponse.json(
        { error: 'User ID or Device ID required' },
        { status: 400 }
      )
    }

    // First get the user config
    let configQuery = supabase.from('user_configs').select('id')
    if (userId) {
      configQuery = configQuery.eq('user_id', userId)
    } else {
      configQuery = configQuery.eq('device_id', deviceId)
    }

    const { data: config, error: configError } = await configQuery.single()

    if (configError || !config) {
      return NextResponse.json(
        { error: 'User config not found' },
        { status: 404 }
      )
    }

    const { data: reminder, error } = await supabase
      .from('reminders')
      .insert({
        ...body,
        user_config_id: config.id
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(reminder)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}