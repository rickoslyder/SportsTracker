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

    let query = supabase.from('user_configs').select('*')

    if (userId) {
      query = query.eq('user_id', userId)
    } else if (deviceId) {
      query = query.eq('device_id', deviceId)
    }

    const { data: config, error } = await query.single()

    if (error && error.code !== 'PGRST116') { // Not found error
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(config || null)
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

    const configData = {
      ...body,
      user_id: userId || null,
      device_id: deviceId || null,
      user_email: body.user_email || null,
      updated_at: new Date().toISOString()
    }

    const { data: config, error } = await supabase
      .from('user_configs')
      .upsert(configData, {
        onConflict: userId ? 'user_id' : 'device_id'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}