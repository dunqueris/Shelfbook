import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  const profileId = searchParams.get('profile_id')

  if (!profileId) {
    return NextResponse.json({ error: 'Profile ID required' }, { status: 400 })
  }

  const { data: sections, error } = await supabase
    .from('sections')
    .select('*')
    .eq('profile_id', profileId)
    .eq('visible', true)
    .order('position')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(sections)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { profile_id, title, type, content, position } = body

  // Verify user owns the profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('id', profile_id)
    .single()

  if (!profile || profile.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { data: section, error } = await supabase
    .from('sections')
    .insert({
      profile_id,
      title,
      type,
      content,
      position,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(section)
}

export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, title, content, visible } = body

  // Verify user owns the section
  const { data: section } = await supabase
    .from('sections')
    .select('profile_id, profiles!inner(user_id)')
    .eq('id', id)
    .single()

  if (!section || section.profiles.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { data: updatedSection, error } = await supabase
    .from('sections')
    .update({
      title,
      content,
      visible,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(updatedSection)
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Section ID required' }, { status: 400 })
  }

  // Verify user owns the section
  const { data: section } = await supabase
    .from('sections')
    .select('profile_id, profiles!inner(user_id)')
    .eq('id', id)
    .single()

  if (!section || section.profiles.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { error } = await supabase
    .from('sections')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
