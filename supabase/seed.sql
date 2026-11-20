DO $$
DECLARE
    cat1_id UUID;
    cat2_id UUID;
    cat3_id UUID;
    cat4_id UUID;
BEGIN
    INSERT INTO public.categories (name, slug, description, sort_order)
    VALUES ('PRODUK BELAJAR ANAK CERDAS', 'produk-belajar-anak-cerdas', 'Kumpulan lembar kerja cetak, buku hijaiyyah, dan bundel aktivitas edukatif untuk anak.', 1)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order
    RETURNING id INTO cat1_id;

    INSERT INTO public.categories (name, slug, description, sort_order)
    VALUES ('PRODUK DIGITAL ANAK INDONESIA', 'produk-digital-anak-indonesia', 'Media belajar interaktif berbasis digital meliputi flashcard, permainan edukasi, dan kuis.', 2)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order
    RETURNING id INTO cat2_id;

    INSERT INTO public.categories (name, slug, description, sort_order)
    VALUES ('PRODUK DONGENG ANAK', 'produk-dongeng-anak', 'Koleksi cerita dongeng anak dalam format buku PDF dan video animasi mendidik.', 3)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order
    RETURNING id INTO cat3_id;

    INSERT INTO public.categories (name, slug, description, sort_order)
    VALUES ('PRODUK KONTEN KREATOR', 'produk-konten-kreator', 'Asisten cerdas berbasis AI untuk membantu pembuatan naskah, materi ajar, soal, dan ide konten.', 4)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order
    RETURNING id INTO cat4_id;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://drive.google.com/file/d/1PySoSeGAUegweeC1gUgJ5Ui2VD5DWSP4/view?usp=drivesdk') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat1_id, 'Worksheet anak mewarnai seratus lembar', 'Koleksi 100 lembar aktivitas mewarnai edukatif untuk melatih motorik halus dan kreativitas warna anak.', 'https://drive.google.com/file/d/1PySoSeGAUegweeC1gUgJ5Ui2VD5DWSP4/view?usp=drivesdk', TRUE, 1);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://drive.google.com/file/d/11y5UZ2VErHEVORRK5YmmL6MBfYpb1Wxp/view?usp=drivesdk') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat1_id, 'Buku aku bisa Hijaiyyah', 'Panduan belajar mengenal dan menulis huruf Hijaiyyah dengan ilustrasi ramah anak yang mudah dipahami.', 'https://drive.google.com/file/d/11y5UZ2VErHEVORRK5YmmL6MBfYpb1Wxp/view?usp=drivesdk', TRUE, 2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://drive.google.com/drive/folders/1W1G9OOOACY7ox0TkU5QLaq2KkwwLW32j') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat1_id, 'Worksheet spesial Edition (detektif, dokter, pemadam, koki)', 'Lembar kerja tematik bermain peran profesi seru: detektif cilik, dokter, pemadam kebakaran, dan koki.', 'https://drive.google.com/drive/folders/1W1G9OOOACY7ox0TkU5QLaq2KkwwLW32j', TRUE, 3);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://drive.google.com/drive/folders/13eTB02UmZZLt-lFvZzG9JLmHiLryyF9V') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat1_id, 'Mega Bundling 15 folder best seller', 'Paket lengkap berisi 15 folder lembar aktivitas belajar terbaik untuk stimulasi kecerdasan anak usia dini.', 'https://drive.google.com/drive/folders/13eTB02UmZZLt-lFvZzG9JLmHiLryyF9V', TRUE, 4);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://drive.google.com/drive/folders/1GVII3Lf2urZiylERDoPYdOxDycrvx4ZA') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat1_id, 'Worksheet 12 Seri - Volume 1', 'Kumpulan 12 seri lembar kerja terstruktur Volume 1 mencakup logika dasar, berhitung, dan pengenalan bentuk.', 'https://drive.google.com/drive/folders/1GVII3Lf2urZiylERDoPYdOxDycrvx4ZA', TRUE, 5);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://drive.google.com/drive/folders/17DXBBvgWzaaZiaxHYRlrgO2_Phbhucr7') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat1_id, 'WORKSHEET 16 Seri — VOLUME 2', 'Lanjutan 16 seri lembar kerja edukasi Volume 2 dengan tantangan kognitif yang lebih variatif dan menyenangkan.', 'https://drive.google.com/drive/folders/17DXBBvgWzaaZiaxHYRlrgO2_Phbhucr7', TRUE, 6);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://www.digitalprodukno1seindonesia.my.id/worksheet') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat2_id, 'Lembar Kerja Anak Hebat', 'Akses portal lembar kerja digital interaktif siap pakai untuk mendampingi kegiatan belajar anak di rumah.', 'https://www.digitalprodukno1seindonesia.my.id/worksheet', TRUE, 7);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://www.digitalprodukno1seindonesia.my.id/flash-card') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat2_id, 'Kartu Belajar Anak', 'Kartu pintar (flashcard) visual penuh warna untuk memperkaya kosakata dan daya ingat anak.', 'https://www.digitalprodukno1seindonesia.my.id/flash-card', TRUE, 8);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://www.digitalprodukno1seindonesia.my.id/game-edukasi') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat2_id, 'Permainan Edukasi', 'Koleksi permainan digital edukatif yang melatih fokus, ketangkasan berpikir, dan pemecahan masalah.', 'https://www.digitalprodukno1seindonesia.my.id/game-edukasi', TRUE, 9);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://www.digitalprodukno1seindonesia.my.id/quiz') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat2_id, 'Kuis Edukasi', 'Latihan kuis interaktif untuk mengasah pengetahuan umum dan pemahaman materi belajar anak secara ceria.', 'https://www.digitalprodukno1seindonesia.my.id/quiz', TRUE, 10);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://sites.google.com/view/generasi554/e-book/cerita-hewan?pli=1&authuser=0') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat2_id, 'Buku Digital Anak (Cerita Hewan)', 'E-book bergambar bertema dunia hewan yang sarat pesan moral dan menumbuhkan minat baca sejak dini.', 'https://sites.google.com/view/generasi554/e-book/cerita-hewan?pli=1&authuser=0', TRUE, 11);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://drive.google.com/drive/folders/1_e13PVaR9OS3o8yFi3tWOU1RugAZthsv') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat3_id, '99 pdf dongeng', 'Pustaka 99 buku cerita dongeng anak format PDF siap baca bersama orang tua sebelum tidur.', 'https://drive.google.com/drive/folders/1_e13PVaR9OS3o8yFi3tWOU1RugAZthsv', TRUE, 12);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://drive.google.com/drive/folders/1fliQXDRS5zYbj793D3SEMfPN7NwAVdpB') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat3_id, '99 video dongeng', 'Kumpulan 99 tayangan video dongeng anak penuh pesan kebaikan yang menarik dan ramah keluarga.', 'https://drive.google.com/drive/folders/1fliQXDRS5zYbj793D3SEMfPN7NwAVdpB', TRUE, 13);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://gemini.google.com/share/5e2d21e70d81?hl=id') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat4_id, 'Tools Studio Promptiva', 'Asisten penyusun prompt cerdas untuk menghasilkan ide visual, ilustrasi, dan konsep konten kreatif.', 'https://gemini.google.com/share/5e2d21e70d81?hl=id', TRUE, 14);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://gemini.google.com/share/63312307ba81?hl=id') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat4_id, 'Tools Studio Script', 'Bantu merancang alur cerita dan naskah video edukasi maupun hiburan secara cepat dan terstruktur.', 'https://gemini.google.com/share/63312307ba81?hl=id', TRUE, 15);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://gemini.google.com/share/3bdec8f3be13?hl=id') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat4_id, 'Tools Studio Suara', 'Panduan penyusunan narasi sulih suara (voice over) yang ekspresif dan memikat untuk konten audio-visual.', 'https://gemini.google.com/share/3bdec8f3be13?hl=id', TRUE, 16);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://gemini.google.com/share/71487a50d705?hl=id-ID') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat4_id, 'Tools AI Script', 'Generator ide dan kerangka skrip praktis untuk kebutuhan konten media sosial dan edukasi digital.', 'https://gemini.google.com/share/71487a50d705?hl=id-ID', TRUE, 17);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://gemini.google.com/share/c8de7e4afbb8?hl=id-ID') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat4_id, 'Tools Materi Ajar', 'Asisten penyusun modul dan ringkasan materi pembelajaran terstruktur untuk guru maupun orang tua.', 'https://gemini.google.com/share/c8de7e4afbb8?hl=id-ID', TRUE, 18);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_url = 'https://gemini.google.com/share/867599217d97?hl=id-ID') THEN
        INSERT INTO public.products (category_id, name, description, product_url, is_published, sort_order)
        VALUES (cat4_id, 'Tools Pembuat Soal', 'Bantu membuat latihan soal dan evaluasi belajar anak secara otomatis sesuai topik pilihan.', 'https://gemini.google.com/share/867599217d97?hl=id-ID', TRUE, 19);
    END IF;
END $$;
