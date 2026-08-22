-- ====================================================================
-- NEXORA AGRI AI - Supabase Schema (Phase 2)
-- Copy and paste this into the Supabase SQL Editor and click "Run"
-- ====================================================================

-- 1. Reset old tables
DROP TABLE IF EXISTS public.scans CASCADE;
DROP TABLE IF EXISTS public.plots CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Create Profiles table (Links to Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  phone_number TEXT UNIQUE,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'pro', 'smart', 'enterprise'
  billing_cycle TEXT DEFAULT 'monthly'
);

-- 2. Create Plots table
CREATE TABLE public.plots (
  id TEXT PRIMARY KEY, -- Changed to TEXT to support string IDs like "A-01" from frontend
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  area_size NUMERIC, -- In Rai
  status TEXT DEFAULT 'healthy', -- 'healthy', 'warning', 'critical'
  image_url TEXT,
  plot_data JSONB -- Stores the full React Plot object for seamless frontend sync
);

-- 3. Create Scans table (History of AI Disease Detection)
CREATE TABLE public.scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plot_id TEXT REFERENCES public.plots(id) ON DELETE CASCADE, -- Optional link to a specific plot
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  image_url TEXT NOT NULL,
  ai_result TEXT, -- The raw output from Gemini
  disease_name TEXT,
  confidence NUMERIC
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Plots: Users can CRUD their own plots
CREATE POLICY "Users can view own plots" ON public.plots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plots" ON public.plots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plots" ON public.plots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plots" ON public.plots FOR DELETE USING (auth.uid() = user_id);

-- Scans: Users can view and create their own scans
CREATE POLICY "Users can view own scans" ON public.scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scans" ON public.scans FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Setup Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.phone);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Setup Storage Bucket for Images
INSERT INTO storage.buckets (id, name, public) VALUES ('farm-images', 'farm-images', true);

CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id = 'farm-images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'farm-images' AND auth.role() = 'authenticated');
