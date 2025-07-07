import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedAdmin() {
  // Replace this with your Clerk user ID
  const adminUserId = 'user_2cNQG7TQq5VJKeFh3WvQqKPHJkq' // You'll need to get this from Clerk dashboard
  
  try {
    // Check if user already has a role
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', adminUserId)
      .single()

    if (existingRole) {
      // Update to admin
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', adminUserId)

      if (error) throw error
      console.log(`Updated user ${adminUserId} to admin role`)
    } else {
      // Insert new admin role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: adminUserId,
          role: 'admin'
        })

      if (error) throw error
      console.log(`Created admin role for user ${adminUserId}`)
    }

    console.log('Admin user seeded successfully!')
  } catch (error) {
    console.error('Error seeding admin:', error)
  }
}

// Run the seed
seedAdmin()