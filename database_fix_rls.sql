-- ========================================
-- FIX FOR RLS POLICY ISSUE
-- ========================================
-- If you're still getting RLS errors after using the API route,
-- run this SQL in your Supabase SQL Editor
-- ========================================

-- Option 1: Create a function that bypasses RLS for profile creation
-- This function runs with SECURITY DEFINER, so it bypasses RLS
CREATE OR REPLACE FUNCTION create_profile_for_user(
  p_user_id UUID,
  p_username TEXT,
  p_display_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile_id UUID;
BEGIN
  INSERT INTO profiles (user_id, username, display_name)
  VALUES (p_user_id, p_username, p_display_name)
  RETURNING id INTO v_profile_id;
  
  RETURN v_profile_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_profile_for_user(UUID, TEXT, TEXT) TO authenticated;

-- ========================================
-- Option 2: Alternative - Update RLS policy to be more permissive
-- (Only use if Option 1 doesn't work)
-- ========================================
-- DROP POLICY IF EXISTS "profiles_insert" ON profiles;
-- CREATE POLICY "profiles_insert" ON profiles FOR INSERT
--   WITH CHECK (
--     auth.uid() = user_id OR
--     auth.uid() IS NOT NULL
--   );

