import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    const deviceId = request.headers.get('x-device-id')

    if (!userId && !deviceId) {
      return NextResponse.json(
        { error: 'User ID or Device ID required' },
        { status: 400 }
      )
    }

    // First verify the reminder belongs to the user
    let configQuery = supabase.from('user_configs').select('id')
    if (userId) {
      configQuery = configQuery.eq('user_id', userId)
    } else {
      configQuery = configQuery.eq('device_id', deviceId)
    }

    const { data: config } = await configQuery.single()

    if (!config) {
      return NextResponse.json(
        { error: 'User config not found' },
        { status: 404 }
      )
    }

    // Delete the reminder
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', params.id)
      .eq('user_config_id', config.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // First verify the reminder belongs to the user
    let configQuery = supabase.from('user_configs').select('id')
    if (userId) {
      configQuery = configQuery.eq('user_id', userId)
    } else {
      configQuery = configQuery.eq('device_id', deviceId)
    }

    const { data: config } = await configQuery.single()

    if (!config) {
      return NextResponse.json(
        { error: 'User config not found' },
        { status: 404 }
      )
    }

    // Update the reminder
    const { data: reminder, error } = await supabase
      .from('reminders')
      .update(body)
      .eq('id', params.id)
      .eq('user_config_id', config.id)
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