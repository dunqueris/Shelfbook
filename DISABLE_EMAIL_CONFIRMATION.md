# How to Disable Email Confirmation in Supabase (For Development)

## Quick Fix: Disable Email Confirmation

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication Settings**
   - Click on **"Authentication"** in the left sidebar
   - Click on **"Providers"** or **"Settings"**

3. **Disable Email Confirmation**
   - Find **"Email Auth"** or **"Email"** settings
   - Look for **"Enable email confirmations"** or **"Confirm email"**
   - **Turn it OFF** (toggle switch)

4. **Save Changes**
   - Click **"Save"** or the changes will auto-save

## Alternative: Keep Email Confirmation But Fix Redirect

If you want to keep email confirmation enabled:

1. **Set Site URL in Supabase**
   - Go to **Authentication** → **URL Configuration**
   - Set **Site URL** to: `http://localhost:3000`
   - Add to **Redirect URLs**: `http://localhost:3000/auth/callback`

2. **The callback handler is already created** at `app/auth/callback/route.ts`
   - This will handle the email confirmation redirect

## Recommended for Development

**Disable email confirmation** - it's the easiest solution for local development. You can re-enable it when you deploy to production.

