# HearWise — Smart Hearing Care for Every Child

A mobile-first school hearing screening platform built for 
children in India.

## Mission
Detect early childhood hearing loss across Indian schools 
using only a smartphone and headphones.

## Features
- Pure tone audiometry test (500, 1000, 2000, 4000 Hz)
- Left and right ear testing with stereo audio
- Tamil and English language support
- Offline-capable with auto-sync
- WhatsApp result sharing for parents
- Secure admin dashboard
- Supabase backend with full RLS security

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS + Shadcn UI
- Supabase (Auth + Database + RLS)
- Deployed on GitHub Pages

## Built by
HearWise Technologies — Coimbatore, Tamil Nadu, India

"Smart Hearing Care for Every Child"

## Database Setup

1. Open your Supabase project dashboard.
2. Go to `SQL Editor`.
3. Create a new query.
4. Copy all SQL from `supabase/migrations/001_initial_schema.sql`.
5. Paste it into the SQL editor and click `Run`.
6. Confirm tables are created and RLS policies are applied.

This sets up:
- Core tables (`schools`, `teachers`, `students`, `test_sessions`, `test_results`, `referrals`)
- Admin tables (`admin_whitelist`, `login_logs`)
- Seeded admin email: `vikash07052008@gmail.com`
- RLS policies for authenticated access
