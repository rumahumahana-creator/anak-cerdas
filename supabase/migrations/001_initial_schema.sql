CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE CHECK (lower(email) = 'humahalife@gmail.com'),
    role TEXT NOT NULL DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE user_id = auth.uid()
          AND lower(email) = 'humahalife@gmail.com'
    );
END;
$$;

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(category_id, slug)
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    product_url TEXT NOT NULL CHECK (product_url ~* '^https?://'),
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    site_name TEXT NOT NULL DEFAULT 'ANAK CERDAS',
    logo_url TEXT DEFAULT '',
    theme TEXT NOT NULL DEFAULT 'OUTER SPACE' CHECK (theme IN ('OUTER SPACE', 'FLOWERS', 'VINTAGE', 'LOLLIPOP')),
    accent_color TEXT NOT NULL DEFAULT '#6366f1',
    appearance_mode TEXT NOT NULL DEFAULT 'light' CHECK (appearance_mode IN ('light', 'dark')),
    catalog_password_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    card_layout TEXT NOT NULL DEFAULT 'comfortable' CHECK (card_layout IN ('comfortable', 'compact')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.site_settings (id, site_name, theme, accent_color, appearance_mode, catalog_password_enabled, card_layout)
VALUES (1, 'ANAK CERDAS', 'OUTER SPACE', '#6366f1', 'light', TRUE, 'comfortable')
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON public.subcategories(category_id, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_published_sort ON public.products(is_published, sort_order ASC, created_at DESC);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_categories_updated ON public.categories;
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_subcategories_updated ON public.subcategories;
CREATE TRIGGER trg_subcategories_updated BEFORE UPDATE ON public.subcategories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated ON public.products;
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_site_settings_updated ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can read own admin record" ON public.admin_users;
CREATE POLICY "Admin can read own admin record"
ON public.admin_users FOR SELECT
TO authenticated
USING (user_id = auth.uid() AND public.is_admin());

DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
CREATE POLICY "Public can read categories"
ON public.categories FOR SELECT
TO anon, authenticated
USING (TRUE);

DROP POLICY IF EXISTS "Only admin can insert categories" ON public.categories;
CREATE POLICY "Only admin can insert categories"
ON public.categories FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admin can update categories" ON public.categories;
CREATE POLICY "Only admin can update categories"
ON public.categories FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admin can delete categories" ON public.categories;
CREATE POLICY "Only admin can delete categories"
ON public.categories FOR DELETE
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Public can read subcategories" ON public.subcategories;
CREATE POLICY "Public can read subcategories"
ON public.subcategories FOR SELECT
TO anon, authenticated
USING (TRUE);

DROP POLICY IF EXISTS "Only admin can manage subcategories" ON public.subcategories;
CREATE POLICY "Only admin can manage subcategories"
ON public.subcategories FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can read published products" ON public.products;
CREATE POLICY "Public can read published products"
ON public.products FOR SELECT
TO anon, authenticated
USING (is_published = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Only admin can insert products" ON public.products;
CREATE POLICY "Only admin can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admin can update products" ON public.products;
CREATE POLICY "Only admin can update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admin can delete products" ON public.products;
CREATE POLICY "Only admin can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (TRUE);

DROP POLICY IF EXISTS "Only admin can update site settings" ON public.site_settings;
CREATE POLICY "Only admin can update site settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES ('catalog-images', 'catalog-images', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

DROP POLICY IF EXISTS "Public can view catalog images" ON storage.objects;
CREATE POLICY "Public can view catalog images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'catalog-images');

DROP POLICY IF EXISTS "Only admin can upload catalog images" ON storage.objects;
CREATE POLICY "Only admin can upload catalog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'catalog-images' AND public.is_admin());

DROP POLICY IF EXISTS "Only admin can update catalog images" ON storage.objects;
CREATE POLICY "Only admin can update catalog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'catalog-images' AND public.is_admin());

DROP POLICY IF EXISTS "Only admin can delete catalog images" ON storage.objects;
CREATE POLICY "Only admin can delete catalog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'catalog-images' AND public.is_admin());

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.subcategories;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
