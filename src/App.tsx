import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import {
Search,
ExternalLink,
RefreshCw,
Lock,
Unlock,
ShieldCheck,
LogOut,
Plus,
Pencil,
Trash2,
Image as ImageIcon,
Upload,
CheckCircle2,
AlertCircle,
Sparkles,
Layers,
FolderTree,
Package,
Settings,
Eye,
EyeOff,
SlidersHorizontal,
ArrowUp,
ArrowDown,
RotateCcw,
Save,
X,
BookOpen,
Wifi,
WifiOff,
Home,
KeyRound,
Mail,
} from 'lucide-react';
// ============================================================================
// 1. KONFIGURASI SUPABASE CLIENT & TIPE DATA
// ============================================================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const ADMIN_ALLOWED_EMAIL = 'humahalife@gmail.com';
const LOCAL_BANNER_STORAGE_KEY = 'rumah_digital_top_banner_url_v1';
const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase: SupabaseClient | null = isSupabaseConfigured
? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
auth: {
persistSession: true,
autoRefreshToken: true,
},
realtime: {
params: {
eventsPerSecond: 10,
},
},
})
: null;
export type ThemeName = 'OUTER SPACE' | 'FLOWERS' | 'VINTAGE' | 'LOLLIPOP';
export type AppearanceMode = 'light' | 'dark';
export type CardLayout = 'comfortable' | 'compact';
export interface Category {
id: string;
name: string;
slug: string;
description: string;
sort_order: number;
created_at: string;
updated_at: string;
}
export interface Subcategory {
id: string;
category_id: string;
name: string;
slug: string;
sort_order: number;
created_at: string;
updated_at: string;
}
export interface Product {
id: string;
category_id: string;
subcategory_id: string | null;
name: string;
description: string;
image_url: string;
product_url: string;
is_published: boolean;
sort_order: number;
created_at: string;
updated_at: string;
}
export interface SiteSettings {
id: number;
site_name: string;
logo_url: string;
banner_url?: string;
theme: ThemeName;
accent_color: string;
appearance_mode: AppearanceMode;
catalog_password_enabled: boolean;
card_layout: CardLayout;
updated_at: string;
}
const DEFAULT_SETTINGS: SiteSettings = {
id: 1,
site_name: 'Rumah Digital',
logo_url: '',
banner_url: '',
theme: 'OUTER SPACE',
accent_color: '#6366f1',
appearance_mode: 'light',
catalog_password_enabled: true,
card_layout: 'comfortable',
updated_at: new Date().toISOString(),
};
function readStoredBannerUrl(): string {
try {
return localStorage.getItem(LOCAL_BANNER_STORAGE_KEY) || '';
} catch {
return '';
}
}
function writeStoredBannerUrl(url: string): void {
try {
if (url.trim()) {
localStorage.setItem(LOCAL_BANNER_STORAGE_KEY, url.trim());
} else {
localStorage.removeItem(LOCAL_BANNER_STORAGE_KEY);
}
} catch {
// Abaikan jika penyimpanan lokal tidak tersedia
}
}
// ============================================================================
// 2. KOMPONEN LATAR BELAKANG DEKORATIF (4 TEMA KAPITAL)
// ============================================================================
const ThemeBackground: React.FC<{ theme: ThemeName; mode: AppearanceMode }> = ({ theme, mode }) => {
const isDark = mode === 'dark';
const baseBgClass = useMemo(() => {
switch (theme) {
case 'OUTER SPACE':
return isDark
? 'bg-gradient-to-br from-[#070B19] via-[#0F172A] to-[#1E1B4B]'
: 'bg-gradient-to-br from-[#EEF2FF] via-[#F5F3FF] to-[#E0E7FF]';
case 'FLOWERS':
return isDark
? 'bg-gradient-to-br from-[#141E1A] via-[#1B2622] to-[#261B24]'
: 'bg-gradient-to-br from-[#FDF4F7] via-[#F4FAF6] to-[#FFF8F1]';
case 'VINTAGE':
return isDark
? 'bg-gradient-to-br from-[#1F1A14] via-[#262018] to-[#1A1612]'
: 'bg-gradient-to-br from-[#FAF5EB] via-[#F5EDE0] to-[#EFE4D2]';
case 'LOLLIPOP':
return isDark
? 'bg-gradient-to-br from-[#231426] via-[#1C1829] to-[#142329]'
: 'bg-gradient-to-br from-[#FFF1F7] via-[#F0F9FF] to-[#FEF9C3]';
}
}, [theme, isDark]);
return (
<div className={⁠fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-500 ${baseBgClass}⁠}>
{theme === 'OUTER SPACE' && (
<svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialGradient id="nebula" cx="50%" cy="50%" r="50%">
<stop offset="0%" stopColor={isDark ? '#818CF8' : '#6366F1'} stopOpacity="0.22" />
<stop offset="100%" stopColor="transparent" stopOpacity="0" />
</radialGradient>
</defs>
<circle cx="15%" cy="20%" r="240" fill="url(#nebula)" />
<circle cx="85%" cy="75%" r="280" fill="url(#nebula)" />
<g transform="translate(88, 120)" stroke={isDark ? '#A5B4FC' : '#6366F1'} fill="none" strokeWidth="1.5">
<circle cx="0" cy="0" r="22" />
<ellipse cx="0" cy="0" rx="38" ry="11" transform="rotate(-22)" />
</g>
<path
d="M 880 90 A 24 24 0 1 0 908 118 A 18 18 0 1 1 880 90 Z"
fill={isDark ? '#FDE68A' : '#F59E0B'}
opacity="0.45"
/>
<g transform="translate(120, 560) rotate(35)" stroke={isDark ? '#93C5FD' : '#4F46E5'} fill="none" strokeWidth="1.5">
<path d="M0 -24 C10 -10 10 10 8 20 L-8 20 C-10 10 -10 -10 0 -24 Z" />
<circle cx="0" cy="-4" r="4" />
<path d="M-8 12 L-16 22 L-8 20 M8 12 L16 22 L8 20" />
</g>
{[
[220, 80], [450, 140], [680, 60], [1050, 210], [310, 420],
[790, 380], [1150, 520], [540, 640], [920, 690], [160, 740],
].map(([cx, cy], idx) => (
<circle
key={idx}
cx={cx}
cy={cy}
r={idx % 2 === 0 ? 2.5 : 1.5}
fill={isDark ? '#E0E7FF' : '#6366F1'}
opacity="0.6"
/>
))}
</svg>
)}
{theme === 'FLOWERS' && (
<svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
{[
{ x: 110, y: 110, s: 1.1, c: isDark ? '#F472B6' : '#EC4899' },
{ x: 1080, y: 150, s: 1.2, c: isDark ? '#34D399' : '#10B981' },
{ x: 180, y: 620, s: 1.0, c: isDark ? '#FBBF24' : '#F59E0B' },
{ x: 980, y: 600, s: 1.15, c: isDark ? '#F472B6' : '#DB2777' },
].map((f, idx) => (
<g key={idx} transform={⁠translate(${f.x}, ${f.y}) scale(${f.s})⁠}>
{[0, 60, 120, 180, 240, 300].map((deg) => (
<ellipse
key={deg}
cx="0"
cy="-18"
rx="8"
ry="15"
fill={f.c}
opacity="0.28"
transform={⁠rotate(${deg})⁠}
/>
))}
<circle cx="0" cy="0" r="6" fill={isDark ? '#FDE68A' : '#F59E0B'} opacity="0.6" />
<path d="M 18 28 Q 36 18 42 36 Q 24 42 18 28 Z" fill={isDark ? '#34D399' : '#10B981'} opacity="0.35" />
</g>
))}
</svg>
)}
{theme === 'VINTAGE' && (
<svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
<g transform="translate(95, 115) rotate(-6)" stroke={isDark ? '#D6B98C' : '#92400E'} fill="none" strokeWidth="1.5">
<rect x="0" y="0" width="64" height="76" strokeDasharray="4 3" rx="3" />
<rect x="8" y="8" width="48" height="60" />
<circle cx="32" cy="34" r="12" />
</g>
<g transform="translate(1020, 140) rotate(8)" stroke={isDark ? '#D6B98C' : '#78350F'} fill="none" strokeWidth="1.5">
<rect x="0" y="0" width="92" height="58" rx="4" />
<path d="M 0 0 L 46 34 L 92 0" />
</g>
<g transform="translate(150, 610) rotate(5)" stroke={isDark ? '#D6B98C' : '#92400E'} fill="none" strokeWidth="1.5">
<rect x="0" y="0" width="110" height="68" rx="3" />
<line x1="55" y1="8" x2="55" y2="60" />
<line x1="65" y1="22" x2="98" y2="22" />
<line x1="65" y1="34" x2="98" y2="34" />
<line x1="65" y1="46" x2="90" y2="46" />
</g>
</svg>
)}
{theme === 'LOLLIPOP' && (
<svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
<g transform="translate(115, 130) rotate(-12)">
<line x1="0" y1="22" x2="0" y2="68" stroke={isDark ? '#E2E8F0' : '#94A3B8'} strokeWidth="4" strokeLinecap="round" />
<circle cx="0" cy="0" r="24" fill={isDark ? '#F472B6' : '#EC4899'} opacity="0.45" />
<path d="M0 0 A 8 8 0 0 1 8 8 A 14 14 0 0 1 -10 10 A 19 19 0 0 1 12 -14" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
</g>
<g transform="translate(1060, 150) rotate(10)">
<polygon points="-16,0 16,0 0,42" fill={isDark ? '#FBBF24' : '#F59E0B'} opacity="0.45" />
<circle cx="0" cy="-6" r="16" fill={isDark ? '#38BDF8' : '#0EA5E9'} opacity="0.45" />
<circle cx="0" cy="-22" r="12" fill={isDark ? '#F472B6' : '#F43F5E'} opacity="0.45" />
</g>
<g transform="translate(190, 620) rotate(22)">
<polygon points="-28,-10 -14,0 -28,10" fill={isDark ? '#A78BFA' : '#8B5CF6'} opacity="0.4" />
<polygon points="28,-10 14,0 28,10" fill={isDark ? '#A78BFA' : '#8B5CF6'} opacity="0.4" />
<ellipse cx="0" cy="0" rx="16" ry="12" fill={isDark ? '#34D399' : '#10B981'} opacity="0.5" />
</g>
</svg>
)}
</div>
);
};
// ============================================================================
// 3. HELPER UTILITAS
// ============================================================================
function createSlug(text: string): string {
return text
.toLowerCase()
.trim()
.replace(/[^a-z0-9\s-]/g, '')
.replace(/\s+/g, '-')
.replace(/-+/g, '-');
}
function isNewProduct(createdAt: string): boolean {
const created = new Date(createdAt).getTime();
if (Number.isNaN(created)) return false;
const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
return Date.now() - created <= sevenDaysMs;
}
// ============================================================================
// 4. KOMPONEN UTAMA APLIKASI
// ============================================================================
export function App() {
const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
const navigate = useCallback((path: string) => {
window.history.pushState({}, '', path);
setCurrentPath(path);
window.scrollTo({ top: 0, behavior: 'smooth' });
}, []);
useEffect(() => {
const handlePopState = () => setCurrentPath(window.location.pathname);
window.addEventListener('popstate', handlePopState);
return () => window.removeEventListener('popstate', handlePopState);
}, []);
const [settings, setSettings] = useState<SiteSettings>(() => ({
...DEFAULT_SETTINGS,
banner_url: readStoredBannerUrl(),
}));
const [categories, setCategories] = useState<Category[]>([]);
const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
const [products, setProducts] = useState<Product[]>([]);
const [loadingData, setLoadingData] = useState<boolean>(true);
const [dataError, setDataError] = useState<string | null>(null);
const [realtimeConnected, setRealtimeConnected] = useState<boolean>(false);
const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
const [session, setSession] = useState<Session | null>(null);
const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);
const [checkingAdmin, setCheckingAdmin] = useState<boolean>(true);
const [catalogUnlocked, setCatalogUnlocked] = useState<boolean>(false);
const [checkingCatalogLock, setCheckingCatalogLock] = useState<boolean>(true);
const fetchAllCentralData = useCallback(async (silent = false) => {
if (!supabase) {
setLoadingData(false);
setDataError(
'Konfigurasi Supabase belum terhubung. Lengkapi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY pada environment variables.'
);
return;
}
if (!silent) setLoadingData(true);
setDataError(null);
try {
const [settingsRes, catRes, subcatRes, prodRes] = await Promise.all([
supabase.from('site_settings').select('').eq('id', 1).maybeSingle(),
supabase.from('categories').select('').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
supabase.from('subcategories').select('').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
supabase.from('products').select('').order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
]);
if (settingsRes.error) throw settingsRes.error;
if (catRes.error) throw catRes.error;
if (subcatRes.error) throw subcatRes.error;
if (prodRes.error) throw prodRes.error;
if (settingsRes.data) {
const dbSettings = settingsRes.data as SiteSettings;
const resolvedBanner = dbSettings.banner_url || readStoredBannerUrl();
setSettings({
...DEFAULT_SETTINGS,
...dbSettings,
banner_url: resolvedBanner,
});
}
setCategories((catRes.data as Category[]) || []);
setSubcategories((subcatRes.data as Subcategory[]) || []);
setProducts((prodRes.data as Product[]) || []);
setLastSyncedAt(new Date());
} catch (err: any) {
setDataError(err?.message || 'Gagal memuat data dari database pusat Supabase.');
} finally {
if (!silent) setLoadingData(false);
}
}, []);
useEffect(() => {
fetchAllCentralData();
if (!supabase) return;
const channel = supabase
.channel('rumah-digital-central-sync')
.on('postgres_changes', { event: '', schema: 'public', table: 'products' }, () => {
fetchAllCentralData(true);
})
.on('postgres_changes', { event: '', schema: 'public', table: 'categories' }, () => {
fetchAllCentralData(true);
})
.on('postgres_changes', { event: '', schema: 'public', table: 'subcategories' }, () => {
fetchAllCentralData(true);
})
.on('postgres_changes', { event: '', schema: 'public', table: 'site_settings' }, () => {
fetchAllCentralData(true);
})
.subscribe((status) => {
setRealtimeConnected(status === 'SUBSCRIBED');
});
const handleVisibilityChange = () => {
if (document.visibilityState === 'visible') {
fetchAllCentralData(true);
}
};
document.addEventListener('visibilitychange', handleVisibilityChange);
return () => {
supabase.removeChannel(channel);
document.removeEventListener('visibilitychange', handleVisibilityChange);
};
}, [fetchAllCentralData]);
useEffect(() => {
document.title = ⁠${settings.site_name || 'Rumah Digital'} — Katalog Digital⁠;
}, [settings.site_name]);
const verifyAdminPrivilege = useCallback(async (currentSession: Session | null) => {
if (!supabase || !currentSession?.user) {
setIsAdminVerified(false);
setCheckingAdmin(false);
return;
}
const userEmail = (currentSession.user.email || '').toLowerCase();
if (userEmail !== ADMIN_ALLOWED_EMAIL) {
setIsAdminVerified(false);
setCheckingAdmin(false);
return;
}
try {
const { data, error } = await supabase
.from('admin_users')
.select('id, user_id, email, role')
.eq('user_id', currentSession.user.id)
.maybeSingle();
if (error || !data) {
setIsAdminVerified(false);
} else {
setIsAdminVerified(true);
}
} catch {
setIsAdminVerified(false);
} finally {
setCheckingAdmin(false);
}
}, []);
useEffect(() => {
if (!supabase) {
setCheckingAdmin(false);
return;
}
supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
setSession(initialSession);
verifyAdminPrivilege(initialSession);
});
const {
data: { subscription },
} = supabase.auth.onAuthStateChange((_event, updatedSession) => {
setSession(updatedSession);
verifyAdminPrivilege(updatedSession);
fetchAllCentralData(true);
});
return () => subscription.unsubscribe();
}, [verifyAdminPrivilege, fetchAllCentralData]);
useEffect(() => {
const checkCatalogSession = async () => {
const savedToken = localStorage.getItem('rumah_digital_catalog_token');
if (!savedToken) {
setCatalogUnlocked(false);
setCheckingCatalogLock(false);
return;
}
try {
const res = await fetch('/.netlify/functions/verify-catalog', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ action: 'verify-session', token: savedToken }),
});
if (res.ok) {
setCatalogUnlocked(true);
} else {
localStorage.removeItem('rumah_digital_catalog_token');
setCatalogUnlocked(false);
}
} catch {
setCatalogUnlocked(Boolean(savedToken));
} finally {
setCheckingCatalogLock(false);
}
};
checkCatalogSession();
}, []);
const isDark = settings.appearance_mode === 'dark';
const isAdminRoute = currentPath.startsWith('/admin');
return (
<div className={⁠min-h-screen font-sans transition-colors duration-300 ${isDark ? 'text-slate-100' : 'text-slate-800'}⁠}>
<ThemeBackground theme={settings.theme} mode={settings.appearance_mode} />
{isAdminRoute ? (
<AdminRouteContainer
supabase={supabase}
isSupabaseConfigured={isSupabaseConfigured}
session={session}
isAdminVerified={isAdminVerified}
checkingAdmin={checkingAdmin}
settings={settings}
categories={categories}
subcategories={subcategories}
products={products}
loadingData={loadingData}
onRefreshData={() => fetchAllCentralData(false)}
onNavigateHome={() => navigate('/')}
/>
) : (
<PublicCatalogView
settings={settings}
categories={categories}
subcategories={subcategories}
products={products}
loadingData={loadingData}
dataError={dataError}
realtimeConnected={realtimeConnected}
lastSyncedAt={lastSyncedAt}
isAdminVerified={isAdminVerified}
catalogUnlocked={catalogUnlocked || isAdminVerified}
checkingCatalogLock={checkingCatalogLock}
onUnlockCatalog={(token) => {
localStorage.setItem('rumah_digital_catalog_token', token);
setCatalogUnlocked(true);
}}
onRefreshData={() => fetchAllCentralData(false)}
onNavigateAdmin={() => navigate('/admin')}
/>
)}
</div>
);
}
// ============================================================================
// 5. GERBANG PASSWORD KATALOG BERSAMA (VERIFIKASI SERVER-SIDE)
// ============================================================================
const CatalogPasswordGate: React.FC<{
settings: SiteSettings;
onUnlock: (token: string) => void;
}> = ({ settings, onUnlock }) => {
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [errorMsg, setErrorMsg] = useState<string | null>(null);
const isDark = settings.appearance_mode === 'dark';
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!password.trim()) {
setErrorMsg('Silakan masukkan kata sandi katalog.');
return;
}
setSubmitting(true);
setErrorMsg(null);
try {
const response = await fetch('/.netlify/functions/verify-catalog', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ password }),
});
const result = await response.json();
if (!response.ok || !result.ok) {
setErrorMsg(result.message || 'Kata sandi katalog salah.');
} else {
onUnlock(result.token);
}
} catch {
setErrorMsg('Gagal terhubung ke server verifikasi. Pastikan fungsi Netlify aktif.');
} finally {
setSubmitting(false);
}
};
return (
<div className="min-h-screen flex items-center justify-center px-4 py-12">
<div
className={⁠w-full max-w-md rounded-3xl p-8 shadow-2xl border backdrop-blur-xl transition-all ${ isDark ? 'bg-slate-900/85 border-slate-700/70 text-slate-100' : 'bg-white/90 border-white/80 text-slate-800' }⁠}
>
<div className="flex flex-col items-center text-center mb-6">
{settings.logo_url ? (
<img src={settings.logo_url} alt={settings.site_name} className="w-16 h-16 rounded-2xl object-cover mb-4 shadow-md" />
) : (
<div
className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"
style={{ backgroundColor: settings.accent_color }}
>
<Lock className="w-8 h-8" />
</div>
)}
<span
className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2"
style={{ backgroundColor: ⁠${settings.accent_color}20⁠, color: settings.accent_color }}
>
Akses Eksklusif Pembeli
</span>
<h1 className="text-2xl font-extrabold tracking-tight">{settings.site_name}</h1>
<p className={⁠text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}⁠}>
Masukkan kata sandi katalog untuk membuka seluruh koleksi sumber belajar digital.
</p>
</div>
<form onSubmit={handleSubmit} className="space-y-4">
<div>
<label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
Kata Sandi Katalog
</label>
<div className="relative">
<input
type={showPassword ? 'text' : 'password'}
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="Masukkan kata sandi akses..."
className={⁠w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition ${ isDark ? 'bg-slate-800/90 border-slate-700 focus:border-indigo-400 text-white' : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900' }⁠}
/>
<button
type="button"
onClick={() => setShowPassword(!showPassword)}
className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
aria-label="Tampilkan atau sembunyikan kata sandi"
>
{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
</button>
</div>
</div>
{errorMsg && (
<div className="flex items-start gap-2 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
<AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
<span>{errorMsg}</span>
</div>
)}
<button
type="submit"
disabled={submitting}
className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-60"
style={{ backgroundColor: settings.accent_color }}
>
<Unlock className="w-4 h-4" />
{submitting ? 'Memverifikasi Akses...' : 'BUKA KATALOG SEKARANG'}
</button>
</form>
</div>
</div>
);
};
// ============================================================================
// 6. HALAMAN KATALOG PUBLIK (/) + BANNER ATAS WEB
// ============================================================================
const PublicCatalogView: React.FC<{
settings: SiteSettings;
categories: Category[];
subcategories: Subcategory[];
products: Product[];
loadingData: boolean;
dataError: string | null;
realtimeConnected: boolean;
lastSyncedAt: Date | null;
isAdminVerified: boolean;
catalogUnlocked: boolean;
checkingCatalogLock: boolean;
onUnlockCatalog: (token: string) => void;
onRefreshData: () => void;
onNavigateAdmin: () => void;
}> = ({
settings,
categories,
subcategories,
products,
loadingData,
dataError,
realtimeConnected,
lastSyncedAt,
isAdminVerified,
catalogUnlocked,
checkingCatalogLock,
onUnlockCatalog,
onRefreshData,
onNavigateAdmin,
}) => {
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('ALL');
const isDark = settings.appearance_mode === 'dark';
useEffect(() => {
setSelectedSubcategoryId('ALL');
}, [selectedCategoryId]);
const publishedProducts = useMemo(
() => products.filter((p) => p.is_published),
[products]
);
const visibleSubcategories = useMemo(() => {
if (selectedCategoryId === 'ALL') return [];
return subcategories.filter((s) => s.category_id === selectedCategoryId);
}, [subcategories, selectedCategoryId]);
const filteredProducts = useMemo(() => {
return publishedProducts.filter((product) => {
const matchCat = selectedCategoryId === 'ALL' || product.category_id === selectedCategoryId;
const matchSub = selectedSubcategoryId === 'ALL' || product.subcategory_id === selectedSubcategoryId;
const q = searchQuery.trim().toLowerCase();
const matchQuery =
!q ||
product.name.toLowerCase().includes(q) ||
(product.description || '').toLowerCase().includes(q);
return matchCat && matchSub && matchQuery;
});
}, [publishedProducts, selectedCategoryId, selectedSubcategoryId, searchQuery]);
const categoryMap = useMemo(() => {
const map = new Map<string, Category>();
categories.forEach((c) => map.set(c.id, c));
return map;
}, [categories]);
if (!loadingData && !checkingCatalogLock && settings.catalog_password_enabled && !catalogUnlocked) {
return <CatalogPasswordGate settings={settings} onUnlock={onUnlockCatalog} />;
}
return (
<div className="min-h-screen flex flex-col">
<header
className={⁠sticky top-0 z-30 backdrop-blur-xl border-b transition-colors ${ isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-white/80 border-slate-200/70' }⁠}
>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between gap-4">
<div className="flex items-center gap-3 min-w-0">
{settings.logo_url ? (
<img
src={settings.logo_url}
alt={settings.site_name}
className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0"
/>
) : (
<div
className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
style={{ backgroundColor: settings.accent_color }}
>
<BookOpen className="w-5 h-5" />
</div>
)}
<div className="min-w-0">
<h1 className="text-lg sm:text-xl font-extrabold tracking-tight truncate">
{settings.site_name}
</h1>
<p className={⁠text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}⁠}>
Katalog Digital & Sumber Belajar Anak
</p>
</div>
</div>
<div className="flex items-center gap-2 sm:gap-3 shrink-0">
<div
className={⁠hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${ isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600' }⁠}
title={lastSyncedAt ? ⁠Terakhir sinkron: ${lastSyncedAt.toLocaleTimeString('id-ID')}⁠ : 'Status sinkronisasi'}
>
{realtimeConnected ? (
<>
<Wifi className="w-3.5 h-3.5 text-emerald-500" />
<span>Live Sync</span>
</>
) : (
<>
<WifiOff className="w-3.5 h-3.5 text-amber-500" />
<span>Mode Manual</span>
</>
)}
</div>
<button
onClick={onRefreshData}
disabled={loadingData}
className={⁠p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${ isDark ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700' }⁠}
title="Segarkan katalog dari database pusat"
>
<RefreshCw className={⁠w-4 h-4 ${loadingData ? 'animate-spin' : ''}⁠} />
<span className="hidden sm:inline">Segarkan</span>
</button>
<button
onClick={onNavigateAdmin}
className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-95 transition flex items-center gap-1.5"
style={{ backgroundColor: settings.accent_color }}
>
<ShieldCheck className="w-4 h-4" />
<span>{isAdminVerified ? 'Dashboard Admin' : 'Admin'}</span>
</button>
</div>
</div>
</header>
<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
{/* BANNER UTAMA DI BAGIAN ATAS WEB (JIKA SUDAH DIUNGGAH / DIATUR) */}
{settings.banner_url && (
<section
className={⁠rounded-3xl overflow-hidden border shadow-md ${ isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-white' }⁠}
>
<div className="w-full max-h-64 sm:max-h-80 overflow-hidden">
<img
src={settings.banner_url}
alt={⁠Banner ${settings.site_name}⁠}
className="w-full h-full object-cover"
/>
</div>
</section>
)}
<section
className={⁠rounded-3xl p-6 sm:p-8 border backdrop-blur-md shadow-sm ${ isDark ? 'bg-slate-900/75 border-slate-800' : 'bg-white/85 border-white' }⁠}
>
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
<div className="space-y-1.5 max-w-2xl">
<div
className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
style={{ backgroundColor: ⁠${settings.accent_color}18⁠, color: settings.accent_color }}
>
<Sparkles className="w-3.5 h-3.5" />
<span>Etalase Sumber Belajar Terpadu</span>
</div>
<h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
Temukan Materi Belajar & Kreasi Terbaik
</h2>
<p className={⁠text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}⁠}>
Pilih kategori atau gunakan pencarian cepat untuk mengakses lembar kerja, buku digital, dongeng, dan perangkat kreator.
</p>
</div>
<div className="w-full lg:w-96">
<div className="relative">
<Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
<input
type="text"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
placeholder="Cari nama produk atau topik..."
className={⁠w-full pl-11 pr-10 py-3.5 rounded-2xl border text-sm outline-none transition ${ isDark ? 'bg-slate-800/90 border-slate-700 focus:border-indigo-400 text-white placeholder:text-slate-400' : 'bg-slate-50/90 border-slate-200 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400' }⁠}
/>
{searchQuery && (
<button
onClick={() => setSearchQuery('')}
className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
aria-label="Hapus pencarian"
>
<X className="w-4 h-4" />
</button>
)}
</div>
</div>
</div>
<div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/80 space-y-3">
<div className="flex items-center gap-2 overflow-x-auto pb-1">
<button
onClick={() => setSelectedCategoryId('ALL')}
className={⁠px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${ selectedCategoryId === 'ALL' ? 'text-white shadow-md' : isDark ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70' }⁠}
style={selectedCategoryId === 'ALL' ? { backgroundColor: settings.accent_color } : undefined}
>
SEMUA KATEGORI ({publishedProducts.length})
</button>
{categories.map((cat) => {
const count = publishedProducts.filter((p) => p.category_id === cat.id).length;
const active = selectedCategoryId === cat.id;
return (
<button
key={cat.id}
onClick={() => setSelectedCategoryId(cat.id)}
className={⁠px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${ active ? 'text-white shadow-md' : isDark ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70' }⁠}
style={active ? { backgroundColor: settings.accent_color } : undefined}
>
{cat.name} ({count})
</button>
);
})}
</div>
{visibleSubcategories.length > 0 && (
<div className="flex items-center gap-2 overflow-x-auto pt-1">
<span className="text-xs font-semibold opacity-60 shrink-0">Subkategori:</span>
<button
onClick={() => setSelectedSubcategoryId('ALL')}
className={⁠px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${ selectedSubcategoryId === 'ALL' ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' : 'opacity-70 hover:opacity-100' }⁠}
>
Semua
</button>
{visibleSubcategories.map((sub) => (
<button
key={sub.id}
onClick={() => setSelectedSubcategoryId(sub.id)}
className={⁠px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${ selectedSubcategoryId === sub.id ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' : 'opacity-70 hover:opacity-100' }⁠}
>
{sub.name}
</button>
))}
</div>
)}
</div>
</section>
<div className="flex items-center justify-between text-xs sm:text-sm px-1">
<p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
Menampilkan <span className="font-bold">{filteredProducts.length}</span> dari{' '}
<span className="font-bold">{publishedProducts.length}</span> produk tersedia
</p>
{selectedCategoryId !== 'ALL' && categoryMap.get(selectedCategoryId)?.description && (
<p className="hidden md:block text-xs opacity-75 truncate max-w-md">
{categoryMap.get(selectedCategoryId)?.description}
</p>
)}
</div>
{loadingData ? (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
{Array.from({ length: 6 }).map((_, idx) => (
<div
key={idx}
className={⁠rounded-3xl p-5 border animate-pulse space-y-4 ${ isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white/80 border-slate-100' }⁠}
>
<div className={⁠h-44 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-200/70'}⁠} />
<div className={⁠h-4 w-24 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200/70'}⁠} />
<div className={⁠h-6 w-3/4 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200/70'}⁠} />
<div className={⁠h-10 w-full rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-200/70'}⁠} />
</div>
))}
</div>
) : dataError ? (
<div
className={⁠rounded-3xl p-8 border text-center max-w-xl mx-auto space-y-4 ${ isDark ? 'bg-slate-900/85 border-rose-500/30' : 'bg-white/90 border-rose-200' }⁠}
>
<AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
<h3 className="text-lg font-bold">Koneksi Database Memerlukan Perhatian</h3>
<p className={⁠text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}⁠}>{dataError}</p>
<button
onClick={onRefreshData}
className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md"
style={{ backgroundColor: settings.accent_color }}
>
Coba Muat Ulang
</button>
</div>
) : filteredProducts.length === 0 ? (
<div
className={⁠rounded-3xl p-12 border text-center max-w-lg mx-auto space-y-3 ${ isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/85 border-slate-200/70' }⁠}
>
<Package className="w-12 h-12 mx-auto opacity-40" />
<h3 className="text-lg font-bold">Tidak Ada Produk Ditemukan</h3>
<p className={⁠text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}⁠}>
Coba ubah kata kunci pencarian atau pilih kategori lainnya untuk melihat sumber belajar yang tersedia.
</p>
{(searchQuery || selectedCategoryId !== 'ALL') && (
<button
onClick={() => {
setSearchQuery('');
setSelectedCategoryId('ALL');
}}
className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white"
style={{ backgroundColor: settings.accent_color }}
>
Reset Filter Pencarian
</button>
)}
</div>
) : (
<div
className={⁠grid gap-6 ${ settings.card_layout === 'compact' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' }⁠}
>
{filteredProducts.map((product) => {
const cat = categoryMap.get(product.category_id);
const fresh = isNewProduct(product.created_at);
return (
<article
key={product.id}
className={⁠group rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-md ${ isDark ? 'bg-slate-900/85 border-slate-800 hover:border-slate-700' : 'bg-white/95 border-slate-200/80 hover:border-slate-300 shadow-sm' }⁠}
>
<div>
<div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
{product.image_url ? (
<img
src={product.image_url}
alt={product.name}
loading="lazy"
className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
/>
) : (
<div
className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
style={{
background: ⁠linear-gradient(135deg, ${settings.accent_color}22, ${settings.accent_color}08)⁠,
}}
>
<BookOpen className="w-10 h-10 mb-2 opacity-60" style={{ color: settings.accent_color }} />
<span className="text-xs font-bold uppercase tracking-wider opacity-60 line-clamp-1">
{cat?.name || settings.site_name}
</span>
</div>
)}
{fresh && (
<span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white shadow-md">
BARU
</span>
)}
</div>
<div className="p-5 sm:p-6 space-y-2.5">
{cat && (
<span
className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md"
style={{
backgroundColor: ⁠${settings.accent_color}18⁠,
color: settings.accent_color,
}}
>
{cat.name}
</span>
)}
<h3 className="text-base sm:text-lg font-bold leading-snug line-clamp-2">
{product.name}
</h3>
{product.description && (
<p className={⁠text-xs sm:text-sm leading-relaxed line-clamp-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}⁠}>
{product.description}
</p>
)}
</div>
</div>
<div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2">
<a
href={product.product_url}
target="_blank"
rel="noopener noreferrer"
className="w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold text-white shadow-md hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2"
style={{ backgroundColor: settings.accent_color }}
>
<span>BUKA PRODUK</span>
<ExternalLink className="w-4 h-4" />
</a>
</div>
</article>
);
})}
</div>
)}
</main>
<footer
className={⁠mt-16 border-t py-6 text-center text-xs ${ isDark ? 'border-slate-800/80 text-slate-400 bg-slate-950/60' : 'border-slate-200/70 text-slate-500 bg-white/60' }⁠}
>
<div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
<p className="font-semibold">
© {new Date().getFullYear()} {settings.site_name}. Seluruh hak cipta dilindungi.
</p>
<p className="opacity-75">Katalog Digital Sumber Belajar Anak & Kreator Indonesia</p>
</div>
</footer>
</div>
);
};
// ============================================================================
// 7. ROUTER & LOGIN ADMIN (/admin)
// ============================================================================
const AdminRouteContainer: React.FC<{
supabase: SupabaseClient | null;
isSupabaseConfigured: boolean;
session: Session | null;
isAdminVerified: boolean;
checkingAdmin: boolean;
settings: SiteSettings;
categories: Category[];
subcategories: Subcategory[];
products: Product[];
loadingData: boolean;
onRefreshData: () => void;
onNavigateHome: () => void;
}> = (props) => {
const {
supabase,
isSupabaseConfigured,
session,
isAdminVerified,
checkingAdmin,
settings,
onNavigateHome,
} = props;
const isDark = settings.appearance_mode === 'dark';
if (checkingAdmin) {
return (
<div className="min-h-screen flex items-center justify-center p-6">
<div className="text-center space-y-3">
<RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
<p className="text-sm font-semibold">Memverifikasi sesi dan hak akses admin...</p>
</div>
</div>
);
}
if (!session || !isAdminVerified) {
return (
<AdminLoginView
supabase={supabase}
isSupabaseConfigured={isSupabaseConfigured}
session={session}
settings={settings}
onNavigateHome={onNavigateHome}
/>
);
}
return <AdminDashboardView {...props} isDark={isDark} />;
};
const AdminLoginView: React.FC<{
supabase: SupabaseClient | null;
isSupabaseConfigured: boolean;
session: Session | null;
settings: SiteSettings;
onNavigateHome: () => void;
}> = ({ supabase, isSupabaseConfigured, session, settings, onNavigateHome }) => {
const [email, setEmail] = useState(ADMIN_ALLOWED_EMAIL);
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [errorMsg, setErrorMsg] = useState<string | null>(null);
const [infoMsg, setInfoMsg] = useState<string | null>(null);
const isDark = settings.appearance_mode === 'dark';
const handleLogin = async (e: React.FormEvent) => {
e.preventDefault();
if (!supabase) {
setErrorMsg('Supabase belum dikonfigurasi pada environment variables.');
return;
}
const cleanEmail = email.trim().toLowerCase();
if (cleanEmail !== ADMIN_ALLOWED_EMAIL) {
setErrorMsg('Akses ditolak. Hanya email pemilik terdaftar yang diizinkan masuk.');
return;
}
setLoading(true);
setErrorMsg(null);
setInfoMsg(null);
try {
const { error } = await supabase.auth.signInWithPassword({
email: cleanEmail,
password,
});
if (error) {
setErrorMsg(
error.message === 'Invalid login credentials'
? 'Email atau kata sandi admin salah. Silakan coba lagi.'
: error.message
);
}
} catch (err: any) {
setErrorMsg(err?.message || 'Terjadi kesalahan saat mencoba login.');
} finally {
setLoading(false);
}
};
const handlePasswordRecovery = async () => {
if (!supabase) return;
const cleanEmail = email.trim().toLowerCase();
if (cleanEmail !== ADMIN_ALLOWED_EMAIL) {
setErrorMsg('Pemulihan kata sandi hanya tersedia untuk akun pemilik.');
return;
}
setLoading(true);
setErrorMsg(null);
setInfoMsg(null);
try {
const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
redirectTo: ⁠${window.location.origin}/admin⁠,
});
if (error) throw error;
setInfoMsg(⁠Tautan pemulihan kata sandi telah dikirim ke ${cleanEmail}. Periksa kotak masuk atau folder spam Anda.⁠);
} catch (err: any) {
setErrorMsg(err?.message || 'Gagal mengirim email pemulihan kata sandi.');
} finally {
setLoading(false);
}
};
const handleSignOutNonAdmin = async () => {
if (supabase) await supabase.auth.signOut();
};
return (
<div className="min-h-screen flex items-center justify-center px-4 py-12">
<div
className={⁠w-full max-w-md rounded-3xl p-8 shadow-2xl border backdrop-blur-xl ${ isDark ? 'bg-slate-900/90 border-slate-700/80' : 'bg-white/95 border-slate-200/80' }⁠}
>
<div className="flex flex-col items-center text-center mb-6">
<div
className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"
style={{ backgroundColor: settings.accent_color }}
>
<ShieldCheck className="w-7 h-7" />
</div>
<h1 className="text-2xl font-extrabold">Login Pemilik Website</h1>
<p className={⁠text-xs mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}⁠}>
Area terbatas khusus pengelola katalog pusat {settings.site_name}
</p>
</div>
{session && (
<div className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
<p className="font-bold text-amber-600 dark:text-amber-400">
Akun ({session.user.email}) belum memiliki hak admin di database.
</p>
<p className="opacity-80">
Pastikan akun <strong>{ADMIN_ALLOWED_EMAIL}</strong> sudah didaftarkan ke tabel <code>public.admin_users</code> melalui Supabase SQL Editor.
</p>
<button
onClick={handleSignOutNonAdmin}
className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold"
>
Keluar Akun Ini
</button>
</div>
)}
{!isSupabaseConfigured && (
<div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500">
Variabel lingkungan Supabase belum terpasang. Ikuti panduan setup pada file README.md.
</div>
)}
<form onSubmit={handleLogin} className="space-y-4">
<div>
<label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-75">
Email Admin
</label>
<div className="relative">
<Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
<input
type="email"
required
value={email}
onChange={(e) => setEmail(e.target.value)}
className={⁠w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-400' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500' }⁠}
/>
</div>
</div>
<div>
<div className="flex items-center justify-between mb-1.5">
<label className="block text-xs font-bold uppercase tracking-wider opacity-75">
Kata Sandi
</label>
<button
type="button"
onClick={handlePasswordRecovery}
className="text-xs font-semibold hover:underline"
style={{ color: settings.accent_color }}
>
Lupa kata sandi?
</button>
</div>
<div className="relative">
<KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
<input
type={showPassword ? 'text' : 'password'}
required
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="Masukkan password admin Anda"
className={⁠w-full pl-10 pr-11 py-3 rounded-xl border text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-400' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500' }⁠}
/>
<button
type="button"
onClick={() => setShowPassword(!showPassword)}
className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
>
{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
</button>
</div>
</div>
{errorMsg && (
<div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-500 flex items-start gap-2">
<AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
<span>{errorMsg}</span>
</div>
)}
{infoMsg && (
<div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
<CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
<span>{infoMsg}</span>
</div>
)}
<button
type="submit"
disabled={loading || !isSupabaseConfigured}
className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg hover:opacity-95 transition disabled:opacity-50"
style={{ backgroundColor: settings.accent_color }}
>
{loading ? 'Memproses Login...' : 'MASUK KE DASHBOARD ADMIN'}
</button>
</form>
<div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800 text-center">
<button
onClick={onNavigateHome}
className="inline-flex items-center gap-1.5 text-xs font-semibold opacity-70 hover:opacity-100 transition"
>
<Home className="w-3.5 h-3.5" />
<span>Kembali ke Halaman Katalog Pembeli</span>
</button>
</div>
</div>
</div>
);
};
// ============================================================================
// 8. DASHBOARD ADMIN LENGKAP (/admin)
// ============================================================================
type AdminTab = 'products' | 'categories' | 'settings';
const AdminDashboardView: React.FC<{
supabase: SupabaseClient | null;
session: Session | null;
settings: SiteSettings;
categories: Category[];
subcategories: Subcategory[];
products: Product[];
loadingData: boolean;
isDark: boolean;
onRefreshData: () => void;
onNavigateHome: () => void;
}> = ({
supabase,
session,
settings,
categories,
subcategories,
products,
isDark,
onRefreshData,
onNavigateHome,
}) => {
const [activeTab, setActiveTab] = useState<AdminTab>('products');
const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
const showToast = useCallback((type: 'success' | 'error', message: string) => {
setToast({ type, message });
setTimeout(() => setToast(null), 4500);
}, []);
const handleLogout = async () => {
if (supabase) {
await supabase.auth.signOut();
}
};
const stats = useMemo(() => {
const publishedCount = products.filter((p) => p.is_published).length;
return {
totalProducts: products.length,
totalCategories: categories.length,
totalSubcategories: subcategories.length,
publishedCount,
unpublishedCount: products.length - publishedCount,
};
}, [products, categories, subcategories]);
return (
<div className="min-h-screen flex flex-col">
{toast && (
<div className="fixed bottom-5 right-5 z-50 max-w-sm">
<div
className={⁠px-4 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs sm:text-sm font-semibold ${ toast.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-rose-600 text-white border-rose-500' }⁠}
>
{toast.type === 'success' ? (
<CheckCircle2 className="w-5 h-5 shrink-0" />
) : (
<AlertCircle className="w-5 h-5 shrink-0" />
)}
<span>{toast.message}</span>
</div>
</div>
)}
<header
className={⁠sticky top-0 z-30 backdrop-blur-xl border-b ${ isDark ? 'bg-slate-950/85 border-slate-800' : 'bg-white/85 border-slate-200/80' }⁠}
>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
<div className="flex items-center gap-3">
<div
className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
style={{ backgroundColor: settings.accent_color }}
>
<ShieldCheck className="w-5 h-5" />
</div>
<div>
<div className="flex items-center gap-2">
<h1 className="text-base sm:text-lg font-extrabold">Dashboard Admin</h1>
<span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
Terverifikasi
</span>
</div>
<p className="text-xs opacity-65 truncate max-w-[200px] sm:max-w-xs">
{session?.user?.email}
</p>
</div>
</div>
<div className="flex items-center gap-2">
<button
onClick={onNavigateHome}
className={⁠px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${ isDark ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100' }⁠}
>
<Eye className="w-4 h-4" />
<span>Lihat Katalog</span>
</button>
<button
onClick={handleLogout}
className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition"
>
<LogOut className="w-4 h-4" />
<span>Keluar</span>
</button>
</div>
</div>
</header>
<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
<section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
{[
{ label: 'Total Produk', value: stats.totalProducts, icon: Package, color: '#6366f1' },
{ label: 'Dipublikasikan', value: stats.publishedCount, icon: Eye, color: '#10b981' },
{ label: 'Disembunyikan', value: stats.unpublishedCount, icon: EyeOff, color: '#f59e0b' },
{ label: 'Kategori Utama', value: stats.totalCategories, icon: Layers, color: '#ec4899' },
{ label: 'Subkategori', value: stats.totalSubcategories, icon: FolderTree, color: '#0ea5e9' },
].map((item, idx) => {
const Icon = item.icon;
return (
<div
key={idx}
className={⁠rounded-2xl p-4 border backdrop-blur-md ${ isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200/80 shadow-sm' }⁠}
>
<div className="flex items-center justify-between mb-2">
<span className="text-xs font-semibold opacity-70">{item.label}</span>
<Icon className="w-4 h-4" style={{ color: item.color }} />
</div>
<p className="text-2xl font-extrabold">{item.value}</p>
</div>
);
})}
</section>
<nav className="flex items-center gap-2 overflow-x-auto pb-1">
{[
{ id: 'products', label: 'Manajemen Produk', icon: Package },
{ id: 'categories', label: 'Kategori & Subkategori', icon: Layers },
{ id: 'settings', label: 'Pengaturan Global & Tema', icon: Settings },
].map((tab) => {
const Icon = tab.icon;
const active = activeTab === tab.id;
return (
<button
key={tab.id}
onClick={() => setActiveTab(tab.id as AdminTab)}
className={⁠px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${ active ? 'text-white shadow-md' : isDark ? 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800' : 'bg-white/90 text-slate-700 hover:bg-slate-100 border border-slate-200/80' }⁠}
style={active ? { backgroundColor: settings.accent_color } : undefined}
>
<Icon className="w-4 h-4" />
<span>{tab.label}</span>
</button>
);
})}
</nav>
{activeTab === 'products' && supabase && (
<AdminProductsManager
supabase={supabase}
settings={settings}
categories={categories}
subcategories={subcategories}
products={products}
isDark={isDark}
onRefresh={onRefreshData}
showToast={showToast}
/>
)}
{activeTab === 'categories' && supabase && (
<AdminCategoriesManager
supabase={supabase}
settings={settings}
categories={categories}
subcategories={subcategories}
products={products}
isDark={isDark}
onRefresh={onRefreshData}
showToast={showToast}
/>
)}
{activeTab === 'settings' && supabase && (
<AdminGlobalSettingsManager
supabase={supabase}
settings={settings}
isDark={isDark}
onRefresh={onRefreshData}
showToast={showToast}
/>
)}
</main>
</div>
);
};
// ============================================================================
// 9. MODUL MANAJEMEN PRODUK & UPLOAD GAMBAR SUPABASE STORAGE
// ============================================================================
const AdminProductsManager: React.FC<{
supabase: SupabaseClient;
settings: SiteSettings;
categories: Category[];
subcategories: Subcategory[];
products: Product[];
isDark: boolean;
onRefresh: () => void;
showToast: (type: 'success' | 'error', msg: string) => void;
}> = ({ supabase, settings, categories, subcategories, products, isDark, onRefresh, showToast }) => {
const [search, setSearch] = useState('');
const [filterCat, setFilterCat] = useState('ALL');
const [isFormOpen, setIsFormOpen] = useState(false);
const [editingProduct, setEditingProduct] = useState<Product | null>(null);
const [name, setName] = useState('');
const [categoryId, setCategoryId] = useState('');
const [subcategoryId, setSubcategoryId] = useState('');
const [description, setDescription] = useState('');
const [imageUrl, setImageUrl] = useState('');
const [productUrl, setProductUrl] = useState('');
const [isPublished, setIsPublished] = useState(true);
const [sortOrder, setSortOrder] = useState<number>(0);
const [uploadingImage, setUploadingImage] = useState(false);
const [uploadProgress, setUploadProgress] = useState<number>(0);
const [savingProduct, setSavingProduct] = useState(false);
const fileInputRef = useRef<HTMLInputElement | null>(null);
const openAddForm = () => {
setEditingProduct(null);
setName('');
setCategoryId(categories[0]?.id || '');
setSubcategoryId('');
setDescription('');
setImageUrl('');
setProductUrl('');
setIsPublished(true);
setSortOrder(products.length + 1);
setIsFormOpen(true);
};
const openEditForm = (prod: Product) => {
setEditingProduct(prod);
setName(prod.name);
setCategoryId(prod.category_id);
setSubcategoryId(prod.subcategory_id || '');
setDescription(prod.description || '');
setImageUrl(prod.image_url || '');
setProductUrl(prod.product_url);
setIsPublished(prod.is_published);
setSortOrder(prod.sort_order);
setIsFormOpen(true);
};
const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (!file) return;
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
showToast('error', 'Format gambar harus JPG, JPEG, PNG, atau WEBP.');
return;
}
if (file.size > 5 * 1024 * 1024) {
showToast('error', 'Ukuran gambar maksimal 5 MB.');
return;
}
setUploadingImage(true);
setUploadProgress(25);
try {
const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
const fileName = ⁠products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}⁠;
setUploadProgress(60);
const { error: uploadError } = await supabase.storage
.from('catalog-images')
.upload(fileName, file, {
cacheControl: '3600',
upsert: false,
});
if (uploadError) throw uploadError;
setUploadProgress(90);
const { data: publicUrlData } = supabase.storage
.from('catalog-images')
.getPublicUrl(fileName);
setImageUrl(publicUrlData.publicUrl);
setUploadProgress(100);
showToast('success', 'Gambar berhasil diunggah ke penyimpanan pusat!');
} catch (err: any) {
showToast('error', ⁠Gagal mengunggah gambar: ${err?.message || 'Periksa bucket catalog-images di Supabase.'}⁠);
} finally {
setTimeout(() => {
setUploadingImage(false);
setUploadProgress(0);
}, 400);
if (fileInputRef.current) fileInputRef.current.value = '';
}
};
const handleSaveProduct = async (e: React.FormEvent) => {
e.preventDefault();
if (!name.trim() || !categoryId || !productUrl.trim()) {
showToast('error', 'Nama produk, kategori, dan URL produk wajib diisi.');
return;
}
if (!/^https?:///i.test(productUrl.trim())) {
showToast('error', 'URL produk harus diawali dengan http:// atau https://');
return;
}
setSavingProduct(true);
try {
const payload = {
name: name.trim(),
category_id: categoryId,
subcategory_id: subcategoryId || null,
description: description.trim(),
image_url: imageUrl.trim(),
product_url: productUrl.trim(),
is_published: isPublished,
sort_order: Number(sortOrder) || 0,
};
if (editingProduct) {
const { error } = await supabase
.from('products')
.update(payload)
.eq('id', editingProduct.id);
if (error) throw error;
showToast('success', 'Perubahan produk disimpan & langsung tayang ke seluruh pembeli!');
} else {
const { error } = await supabase.from('products').insert(payload);
if (error) throw error;
showToast('success', 'Produk baru ditambahkan & langsung tersinkron ke katalog!');
}
setIsFormOpen(false);
onRefresh();
} catch (err: any) {
showToast('error', err?.message || 'Gagal menyimpan produk ke database.');
} finally {
setSavingProduct(false);
}
};
const handleTogglePublish = async (prod: Product) => {
try {
const { error } = await supabase
.from('products')
.update({ is_published: !prod.is_published })
.eq('id', prod.id);
if (error) throw error;
showToast(
'success',
!prod.is_published ? 'Produk dipublikasikan ke katalog.' : 'Produk disembunyikan dari katalog.'
);
onRefresh();
} catch (err: any) {
showToast('error', err?.message || 'Gagal mengubah status publikasi.');
}
};
const handleDeleteProduct = async (prod: Product) => {
const confirmed = window.confirm(
⁠Apakah Anda yakin ingin menghapus produk "${prod.name}" secara permanen dari database pusat?⁠
);
if (!confirmed) return;
try {
const { error } = await supabase.from('products').delete().eq('id', prod.id);
if (error) throw error;
showToast('success', 'Produk berhasil dihapus dari katalog pusat.');
onRefresh();
} catch (err: any) {
showToast('error', err?.message || 'Gagal menghapus produk.');
}
};
const filteredList = useMemo(() => {
return products.filter((p) => {
const matchCat = filterCat === 'ALL' || p.category_id === filterCat;
const q = search.toLowerCase().trim();
const matchQ = !q || p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
return matchCat && matchQ;
});
}, [products, filterCat, search]);
const formSubcategories = useMemo(
() => subcategories.filter((s) => s.category_id === categoryId),
[subcategories, categoryId]
);
return (
<div className="space-y-6">
<div
className={⁠rounded-3xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${ isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white/95 border-slate-200/80 shadow-sm' }⁠}
>
<div className="flex flex-1 flex-col sm:flex-row gap-3">
<div className="relative flex-1 max-w-md">
<Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
<input
type="text"
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="Cari produk di database..."
className={⁠w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900' }⁠}
/>
</div>
<select
value={filterCat}
onChange={(e) => setFilterCat(e.target.value)}
className={⁠px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none ${ isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800' }⁠}
>
<option value="ALL">Semua Kategori ({products.length})</option>
{categories.map((c) => (
<option key={c.id} value={c.id}>
{c.name}
</option>
))}
</select>
</div>
<button
onClick={openAddForm}
className="px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-white shadow-md hover:opacity-95 transition flex items-center justify-center gap-2 shrink-0"
style={{ backgroundColor: settings.accent_color }}
>
<Plus className="w-4 h-4" />
<span>TAMBAH PRODUK BARU</span>
</button>
</div>
{isFormOpen && (
<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
<div
className={⁠w-full max-w-2xl rounded-3xl p-6 sm:p-8 border shadow-2xl my-8 max-h-[92vh] overflow-y-auto ${ isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800' }⁠}
>
<div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200/60 dark:border-slate-800">
<h2 className="text-lg sm:text-xl font-extrabold">
{editingProduct ? 'Edit Produk Katalog' : 'Tambah Produk Baru'}
</h2>
<button
onClick={() => setIsFormOpen(false)}
className="p-2 rounded-xl hover:bg-slate-500/10"
>
<X className="w-5 h-5" />
</button>
</div>
<form onSubmit={handleSaveProduct} className="space-y-4">
<div>
<label className="block text-xs font-bold uppercase tracking-wider mb-1">
1. Nama Produk *
</label>
<input
type="text"
required
value={name}
onChange={(e) => setName(e.target.value)}
placeholder="Contoh: Worksheet Anak Pintar Berhitung"
className={⁠w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
/>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div>
<label className="block text-xs font-bold uppercase tracking-wider mb-1">
2. Kategori *
</label>
<select
required
value={categoryId}
onChange={(e) => {
setCategoryId(e.target.value);
setSubcategoryId('');
}}
className={⁠w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
>
<option value="" disabled>
Pilih kategori...
</option>
{categories.map((c) => (
<option key={c.id} value={c.id}>
{c.name}
</option>
))}
</select>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-wider mb-1">
3. Subkategori (Opsional)
</label>
<select
value={subcategoryId}
onChange={(e) => setSubcategoryId(e.target.value)}
className={⁠w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
>
<option value="">-- Tanpa Subkategori --</option>
{formSubcategories.map((s) => (
<option key={s.id} value={s.id}>
{s.name}
</option>
))}
</select>
</div>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-wider mb-1">
4. Deskripsi Singkat
</label>
<textarea
rows={3}
value={description}
onChange={(e) => setDescription(e.target.value)}
placeholder="Jelaskan manfaat dan isi produk digital ini untuk pembeli..."
className={⁠w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
/>
</div>
<div className="space-y-2">
<label className="block text-xs font-bold uppercase tracking-wider">
5. Gambar Sampul (JPG, JPEG, PNG, WEBP)
</label>
<div
className={⁠p-4 rounded-2xl border-2 border-dashed flex flex-col sm:flex-row items-center gap-4 ${ isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-slate-50/70' }⁠}
>
{imageUrl ? (
<div className="relative w-32 h-24 rounded-xl overflow-hidden shrink-0 border">
<img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
<button
type="button"
onClick={() => setImageUrl('')}
className="absolute top-1 right-1 p-1 rounded-lg bg-rose-600 text-white shadow"
title="Hapus gambar"
>
<Trash2 className="w-3.5 h-3.5" />
</button>
</div>
) : (
<div className="w-32 h-24 rounded-xl flex flex-col items-center justify-center bg-slate-500/10 shrink-0 text-xs opacity-60">
<ImageIcon className="w-6 h-6 mb-1" />
<span>Belum ada foto</span>
</div>
)}
<div className="flex-1 space-y-2 text-center sm:text-left">
<input
ref={fileInputRef}
type="file"
accept="image/jpeg,image/jpg,image/png,image/webp"
onChange={handleImageFileChange}
className="hidden"
/>
<button
type="button"
disabled={uploadingImage}
onClick={() => fileInputRef.current?.click()}
className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow inline-flex items-center gap-2"
style={{ backgroundColor: settings.accent_color }}
>
<Upload className="w-4 h-4" />
<span>{imageUrl ? 'Ganti Gambar dari Galeri/File' : 'Unggah Gambar dari HP / iPad / PC'}</span>
</button>
{uploadingImage && (
<div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
<div
className="h-full transition-all duration-300"
style={{ width: ⁠${uploadProgress}%⁠, backgroundColor: settings.accent_color }}
/>
</div>
)}
<input
type="url"
value={imageUrl}
onChange={(e) => setImageUrl(e.target.value)}
placeholder="Atau tempel URL gambar langsung (https://...)"
className={⁠w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${ isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200' }⁠}
/>
</div>
</div>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-wider mb-1">
6. URL Tautan Produk *
</label>
<input
type="url"
required
value={productUrl}
onChange={(e) => setProductUrl(e.target.value)}
placeholder="https://drive.google.com/... atau https://gemini.google.com/..."
className={⁠w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
/>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
<label
className={⁠flex items-center justify-between p-3.5 rounded-xl border cursor-pointer ${ isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
>
<span className="text-xs font-bold">7. Status Publikasi</span>
<input
type="checkbox"
checked={isPublished}
onChange={(e) => setIsPublished(e.target.checked)}
className="w-4 h-4 accent-indigo-600"
/>
</label>
<div
className={⁠flex items-center justify-between p-3 rounded-xl border ${ isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
>
<span className="text-xs font-bold">8. Urutan Tampil</span>
<input
type="number"
value={sortOrder}
onChange={(e) => setSortOrder(Number(e.target.value))}
className={⁠w-20 px-2.5 py-1 rounded-lg border text-sm text-right outline-none ${ isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300' }⁠}
/>
</div>
</div>
<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
<button
type="button"
onClick={() => setIsFormOpen(false)}
className={⁠px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border ${ isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100' }⁠}
>
BATAL
</button>
<button
type="submit"
disabled={savingProduct || uploadingImage}
className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white shadow-lg hover:opacity-95 transition flex items-center gap-2 disabled:opacity-50"
style={{ backgroundColor: settings.accent_color }}
>
<Save className="w-4 h-4" />
<span>{savingProduct ? 'MENYIMPAN...' : 'SIMPAN'}</span>
</button>
</div>
</form>
</div>
</div>
)}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{filteredList.map((prod) => {
const catName = categories.find((c) => c.id === prod.category_id)?.name || 'Tanpa Kategori';
return (
<div
key={prod.id}
className={⁠rounded-2xl p-4 border flex gap-4 items-start justify-between transition ${ isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white/95 border-slate-200/80 shadow-sm' }⁠}
>
<div className="flex gap-3.5 min-w-0 flex-1">
{prod.image_url ? (
<img
src={prod.image_url}
alt={prod.name}
className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border"
/>
) : (
<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-500/10 flex items-center justify-center shrink-0">
<BookOpen className="w-6 h-6 opacity-40" />
</div>
)}
<div className="min-w-0 flex-1 space-y-1">
<div className="flex flex-wrap items-center gap-1.5">
<span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500">
#{prod.sort_order} • {catName}
</span>
<span
className={⁠text-[10px] font-bold uppercase px-2 py-0.5 rounded ${ prod.is_published ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400' }⁠}
>
{prod.is_published ? 'Publik' : 'Draft'}
</span>
</div>
<h4 className="font-bold text-sm sm:text-base line-clamp-1">{prod.name}</h4>
<a
href={prod.product_url}
target="_blank"
rel="noopener noreferrer"
className="text-xs opacity-65 hover:opacity-100 truncate block underline"
>
{prod.product_url}
</a>
</div>
</div>
<div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0">
<button
onClick={() => handleTogglePublish(prod)}
className="p-2 rounded-xl border border-slate-300/50 dark:border-slate-700 hover:bg-slate-500/10"
title={prod.is_published ? 'Sembunyikan dari katalog' : 'Publikasikan ke katalog'}
>
{prod.is_published ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-amber-500" />}
</button>
<button
onClick={() => openEditForm(prod)}
className="p-2 rounded-xl border border-slate-300/50 dark:border-slate-700 hover:bg-slate-500/10"
title="Edit produk"
>
<Pencil className="w-4 h-4 text-indigo-500" />
</button>
<button
onClick={() => handleDeleteProduct(prod)}
className="p-2 rounded-xl border border-rose-500/20 hover:bg-rose-500/10"
title="Hapus produk"
>
<Trash2 className="w-4 h-4 text-rose-500" />
</button>
</div>
</div>
);
})}
</div>
</div>
);
};
// ============================================================================
// 10. MODUL MANAJEMEN KATEGORI & SUBKATEGORI
// ============================================================================
const AdminCategoriesManager: React.FC<{
supabase: SupabaseClient;
settings: SiteSettings;
categories: Category[];
subcategories: Subcategory[];
products: Product[];
isDark: boolean;
onRefresh: () => void;
showToast: (type: 'success' | 'error', msg: string) => void;
}> = ({ supabase, settings, categories, subcategories, products, isDark, onRefresh, showToast }) => {
const [newCatName, setNewCatName] = useState('');
const [newCatDesc, setNewCatDesc] = useState('');
const [editingCatId, setEditingCatId] = useState<string | null>(null);
const [editCatName, setEditCatName] = useState('');
const [editCatDesc, setEditCatDesc] = useState('');
const [subParentId, setSubParentId] = useState<string>('');
const [newSubName, setNewSubName] = useState('');
useEffect(() => {
if (!subParentId && categories.length > 0) {
setSubParentId(categories[0].id);
}
}, [categories, subParentId]);
const handleAddCategory = async (e: React.FormEvent) => {
e.preventDefault();
if (!newCatName.trim()) return;
try {
const { error } = await supabase.from('categories').insert({
name: newCatName.trim().toUpperCase(),
slug: ⁠${createSlug(newCatName)}-${Date.now().toString().slice(-4)}⁠,
description: newCatDesc.trim(),
sort_order: categories.length + 1,
});
if (error) throw error;
setNewCatName('');
setNewCatDesc('');
showToast('success', 'Kategori utama baru berhasil ditambahkan.');
onRefresh();
} catch (err: any) {
showToast('error', err?.message || 'Gagal menambah kategori.');
}
};
const handleSaveEditCategory = async (catId: string) => {
if (!editCatName.trim()) return;
try {
const { error } = await supabase
.from('categories')
.update({ name: editCatName.trim().toUpperCase(), description: editCatDesc.trim() })
.eq('id', catId);
if (error) throw error;
setEditingCatId(null);
showToast('success', 'Kategori berhasil diperbarui.');
onRefresh();
} catch (err: any) {
showToast('error', err?.message || 'Gagal memperbarui kategori.');
}
};
const handleMoveCategory = async (index: number, direction: -1 | 1) => {
const targetIdx = index + direction;
if (targetIdx < 0 || targetIdx >= categories.length) return;
const current = categories[index];
const swapWith = categories[targetIdx];
try {
await Promise.all([
supabase.from('categories').update({ sort_order: swapWith.sort_order }).eq('id', current.id),
supabase.from('categories').update({ sort_order: current.sort_order }).eq('id', swapWith.id),
]);
onRefresh();
} catch {
showToast('error', 'Gagal mengubah urutan kategori.');
}
};
const handleDeleteCategory = async (cat: Category) => {
const attachedCount = products.filter((p) => p.category_id === cat.id).length;
if (attachedCount > 0) {
showToast(
'error',
⁠Kategori "${cat.name}" masih memiliki ${attachedCount} produk. Pindahkan atau hapus produk tersebut terlebih dahulu.⁠
);
return;
}
if (!window.confirm(⁠Hapus kategori "${cat.name}"?⁠)) return;
try {
const { error } = await supabase.from('categories').delete().eq('id', cat.id);
if (error) throw error;
showToast('success', 'Kategori berhasil dihapus.');
onRefresh();
} catch (err: any) {
showToast('error', err?.message || 'Gagal menghapus kategori.');
}
};
const handleAddSubcategory = async (e: React.FormEvent) => {
e.preventDefault();
if (!subParentId || !newSubName.trim()) return;
try {
const { error } = await supabase.from('subcategories').insert({
category_id: subParentId,
name: newSubName.trim(),
slug: ⁠${createSlug(newSubName)}-${Date.now().toString().slice(-4)}⁠,
sort_order: subcategories.filter((s) => s.category_id === subParentId).length + 1,
});
if (error) throw error;
setNewSubName('');
showToast('success', 'Subkategori berhasil ditambahkan.');
onRefresh();
} catch (err: any) {
showToast('error', err?.message || 'Gagal menambahkan subkategori.');
}
};
const handleDeleteSubcategory = async (sub: Subcategory) => {
if (!window.confirm(⁠Hapus subkategori "${sub.name}"? Produk di dalamnya tetap aman tanpa subkategori.⁠)) return;
try {
const { error } = await supabase.from('subcategories').delete().eq('id', sub.id);
if (error) throw error;
showToast('success', 'Subkategori berhasil dihapus.');
onRefresh();
} catch (err: any) {
showToast('error', err?.message || 'Gagal menghapus subkategori.');
}
};
return (
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<div
className={⁠rounded-3xl p-6 border space-y-5 ${ isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white/95 border-slate-200/80 shadow-sm' }⁠}
>
<h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
<Layers className="w-5 h-5" style={{ color: settings.accent_color }} />
<span>Kategori Utama Katalog</span>
</h3>
<form onSubmit={handleAddCategory} className="space-y-2.5">
<input
type="text"
value={newCatName}
onChange={(e) => setNewCatName(e.target.value)}
placeholder="Nama kategori baru (misal: PRODUK BUKU ANAK)"
className={⁠w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
/>
<div className="flex gap-2">
<input
type="text"
value={newCatDesc}
onChange={(e) => setNewCatDesc(e.target.value)}
placeholder="Deskripsi singkat kategori..."
className={⁠flex-1 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
/>
<button
type="submit"
className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white shrink-0"
style={{ backgroundColor: settings.accent_color }}
>
+ Tambah
</button>
</div>
</form>
<div className="space-y-2.5">
{categories.map((cat, idx) => {
const count = products.filter((p) => p.category_id === cat.id).length;
const isEditing = editingCatId === cat.id;
return (
<div
key={cat.id}
className={⁠p-3.5 rounded-2xl border ${ isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50/90 border-slate-200' }⁠}
>
{isEditing ? (
<div className="space-y-2">
<input
type="text"
value={editCatName}
onChange={(e) => setEditCatName(e.target.value)}
className={⁠w-full px-3 py-1.5 rounded-lg border text-xs font-bold ${ isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300' }⁠}
/>
<input
type="text"
value={editCatDesc}
onChange={(e) => setEditCatDesc(e.target.value)}
className={⁠w-full px-3 py-1.5 rounded-lg border text-xs ${ isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300' }⁠}
/>
<div className="flex justify-end gap-2">
<button
onClick={() => setEditingCatId(null)}
className="px-3 py-1 rounded-lg text-xs font-semibold opacity-70"
>
Batal
</button>
<button
onClick={() => handleSaveEditCategory(cat.id)}
className="px-3 py-1 rounded-lg text-xs font-bold text-white"
style={{ backgroundColor: settings.accent_color }}
>
Simpan
</button>
</div>
</div>
) : (
<div className="flex items-center justify-between gap-2">
<div className="min-w-0">
<p className="text-xs sm:text-sm font-extrabold truncate">{cat.name}</p>
<p className="text-[11px] opacity-65">{count} produk terdaftar</p>
</div>
<div className="flex items-center gap-1 shrink-0">
<button
onClick={() => handleMoveCategory(idx, -1)}
disabled={idx === 0}
className="p-1.5 rounded-lg hover:bg-slate-500/10 disabled:opacity-30"
title="Naikkan urutan"
>
<ArrowUp className="w-3.5 h-3.5" />
</button>
<button
onClick={() => handleMoveCategory(idx, 1)}
disabled={idx === categories.length - 1}
className="p-1.5 rounded-lg hover:bg-slate-500/10 disabled:opacity-30"
title="Turunkan urutan"
>
<ArrowDown className="w-3.5 h-3.5" />
</button>
<button
onClick={() => {
setEditingCatId(cat.id);
setEditCatName(cat.name);
setEditCatDesc(cat.description || '');
}}
className="p-1.5 rounded-lg hover:bg-slate-500/10"
title="Ubah kategori"
>
<Pencil className="w-3.5 h-3.5 text-indigo-500" />
</button>
<button
onClick={() => handleDeleteCategory(cat)}
className="p-1.5 rounded-lg hover:bg-rose-500/10"
title="Hapus kategori"
>
<Trash2 className="w-3.5 h-3.5 text-rose-500" />
</button>
</div>
</div>
)}
</div>
);
})}
</div>
</div>
<div
className={⁠rounded-3xl p-6 border space-y-5 ${ isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white/95 border-slate-200/80 shadow-sm' }⁠}
>
<h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
<FolderTree className="w-5 h-5" style={{ color: settings.accent_color }} />
<span>Kelola Subkategori</span>
</h3>
<form onSubmit={handleAddSubcategory} className="space-y-2.5">
<select
value={subParentId}
onChange={(e) => setSubParentId(e.target.value)}
className={⁠w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
>
{categories.map((c) => (
<option key={c.id} value={c.id}>
Induk: {c.name}
</option>
))}
</select>
<div className="flex gap-2">
<input
type="text"
value={newSubName}
onChange={(e) => setNewSubName(e.target.value)}
placeholder="Nama subkategori baru..."
className={⁠flex-1 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
/>
<button
type="submit"
className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white shrink-0"
style={{ backgroundColor: settings.accent_color }}
>
+ Subkategori
</button>
</div>
</form>
<div className="space-y-2">
{subcategories.length === 0 ? (
<p className="text-xs opacity-60 py-6 text-center">
Belum ada subkategori. Tambahkan subkategori untuk pengelompokan produk lebih spesifik.
</p>
) : (
subcategories.map((sub) => {
const parentName = categories.find((c) => c.id === sub.category_id)?.name || '';
return (
<div
key={sub.id}
className={⁠p-3 rounded-xl border flex items-center justify-between gap-2 ${ isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50/90 border-slate-200' }⁠}
>
<div>
<p className="text-xs sm:text-sm font-bold">{sub.name}</p>
<p className="text-[11px] opacity-60">{parentName}</p>
</div>
<button
onClick={() => handleDeleteSubcategory(sub)}
className="p-1.5 rounded-lg hover:bg-rose-500/10"
title="Hapus subkategori"
>
<Trash2 className="w-3.5 h-3.5 text-rose-500" />
</button>
</div>
);
})
)}
</div>
</div>
</div>
);
};
// ============================================================================
// 11. MODUL PENGATURAN GLOBAL WEBSITE + UPLOAD BANNER ATAS WEB
// ============================================================================
const AdminGlobalSettingsManager: React.FC<{
supabase: SupabaseClient;
settings: SiteSettings;
isDark: boolean;
onRefresh: () => void;
showToast: (type: 'success' | 'error', msg: string) => void;
}> = ({ supabase, settings, isDark, onRefresh, showToast }) => {
const [draft, setDraft] = useState<SiteSettings>(settings);
const [saving, setSaving] = useState(false);
const [uploadingBanner, setUploadingBanner] = useState(false);
const bannerInputRef = useRef<HTMLInputElement | null>(null);
useEffect(() => {
setDraft(settings);
}, [settings]);
const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (!file) return;
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
showToast('error', 'Format banner harus JPG, JPEG, PNG, atau WEBP.');
return;
}
if (file.size > 5 * 1024 * 1024) {
showToast('error', 'Ukuran banner maksimal 5 MB.');
return;
}
setUploadingBanner(true);
try {
const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
const fileName = ⁠banners/top-banner-${Date.now()}.${ext}⁠;
const { error: uploadError } = await supabase.storage
.from('catalog-images')
.upload(fileName, file, {
cacheControl: '3600',
upsert: true,
});
if (uploadError) throw uploadError;
const { data: publicUrlData } = supabase.storage
.from('catalog-images')
.getPublicUrl(fileName);
const uploadedUrl = publicUrlData.publicUrl;
writeStoredBannerUrl(uploadedUrl);
setDraft((prev) => ({ ...prev, banner_url: uploadedUrl }));
showToast('success', 'Banner berhasil diunggah! Klik SIMPAN PERUBAHAN untuk menayangkan.');
} catch (err: any) {
showToast('error', ⁠Gagal mengunggah banner: ${err?.message || 'Periksa bucket catalog-images.'}⁠);
} finally {
setUploadingBanner(false);
if (bannerInputRef.current) bannerInputRef.current.value = '';
}
};
const handleSaveSettings = async (e: React.FormEvent) => {
e.preventDefault();
setSaving(true);
try {
const cleanBanner = (draft.banner_url || '').trim();
writeStoredBannerUrl(cleanBanner);
const updatePayload: Record<string, any> = {
site_name: draft.site_name.trim() || 'Rumah Digital',
logo_url: draft.logo_url.trim(),
theme: draft.theme,
accent_color: draft.accent_color,
appearance_mode: draft.appearance_mode,
catalog_password_enabled: draft.catalog_password_enabled,
card_layout: draft.card_layout,
};
if (cleanBanner) {
updatePayload.banner_url = cleanBanner;
}
const { error } = await supabase
.from('site_settings')
.update(updatePayload)
.eq('id', 1);
if (error && /banner_url/i.test(error.message || '')) {
const { error: fallbackError } = await supabase
.from('site_settings')
.update({
site_name: updatePayload.site_name,
logo_url: updatePayload.logo_url,
theme: updatePayload.theme,
accent_color: updatePayload.accent_color,
appearance_mode: updatePayload.appearance_mode,
catalog_password_enabled: updatePayload.catalog_password_enabled,
card_layout: updatePayload.card_layout,
})
.eq('id', 1);
if (fallbackError) throw fallbackError;
} else if (error) {
throw error;
}
showToast('success', 'Pengaturan & banner berhasil disimpan!');
onRefresh();
} catch (err: any) {
showToast('error', err?.message || 'Gagal menyimpan pengaturan global.');
} finally {
setSaving(false);
}
};
const handleResetSettings = async () => {
const ok = window.confirm(
'Reset tampilan website ke pengaturan standar (Rumah Digital, OUTER SPACE, Mode Terang)? Data produk dan kategori Anda TIDAK akan dihapus.'
);
if (!ok) return;
setSaving(true);
try {
writeStoredBannerUrl('');
const { error } = await supabase
.from('site_settings')
.update({
site_name: 'Rumah Digital',
logo_url: '',
theme: 'OUTER SPACE',
accent_color: '#6366f1',
appearance_mode: 'light',
catalog_password_enabled: true,
card_layout: 'comfortable',
})
.eq('id', 1);
if (error) throw error;
showToast('success', 'Pengaturan tampilan berhasil dikembalikan ke bawaan.');
onRefresh();
} catch (err: any) {
showToast('error', err?.message || 'Gagal mereset pengaturan.');
} finally {
setSaving(false);
}
};
const themes: { id: ThemeName; desc: string; swatch: string }[] = [
{ id: 'OUTER SPACE', desc: 'Planet, Bintang, Bulan, Roket & Nebula', swatch: 'from-indigo-600 to-purple-700' },
{ id: 'FLOWERS', desc: 'Bunga, Kelopak, Daun & Ornamen Floral', swatch: 'from-pink-500 to-emerald-500' },
{ id: 'VINTAGE', desc: 'Perangko, Amplop, Surat & Kartu Pos Klasik', swatch: 'from-amber-700 to-stone-600' },
{ id: 'LOLLIPOP', desc: 'Lolipop, Cupcake, Es Krim & Permen Ceria', swatch: 'from-rose-500 to-sky-400' },
];
const accentPresets = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6'];
return (
<form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div
className={⁠lg:col-span-2 rounded-3xl p-6 sm:p-8 border space-y-6 ${ isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white/95 border-slate-200/80 shadow-sm' }⁠}
>
<div className="flex items-center gap-2.5 border-b border-slate-200/60 dark:border-slate-800 pb-4">
<SlidersHorizontal className="w-5 h-5" style={{ color: draft.accent_color }} />
<div>
<h3 className="text-lg font-extrabold">Identitas, Banner Atas & Tampilan Global</h3>
<p className="text-xs opacity-65">
Atur nama brand, logo, banner bagian atas web, tema, warna, dan mode terang/gelap.
</p>
</div>
</div>
{/* Upload / Atur Banner di Bagian Atas Web */}
<div className="space-y-2.5">
<label className="block text-xs font-bold uppercase tracking-wider">
Banner Bagian Atas Web (Upload Gambar / URL)
</label>
<div
className={⁠p-4 rounded-2xl border-2 border-dashed space-y-3 ${ isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-slate-50/70' }⁠}
>
{draft.banner_url ? (
<div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden border">
<img src={draft.banner_url} alt="Preview Banner" className="w-full h-full object-cover" />
<button
type="button"
onClick={() => {
writeStoredBannerUrl('');
setDraft((prev) => ({ ...prev, banner_url: '' }));
}}
className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold shadow flex items-center gap-1"
>
<Trash2 className="w-3.5 h-3.5" />
<span>Hapus Banner</span>
</button>
</div>
) : (
<div className="h-28 rounded-xl flex flex-col items-center justify-center bg-slate-500/10 text-xs opacity-65">
<ImageIcon className="w-6 h-6 mb-1" />
<span>Belum ada banner atas web dipasang</span>
</div>
)}
<div className="flex flex-col sm:flex-row gap-2.5">
<input
ref={bannerInputRef}
type="file"
accept="image/jpeg,image/jpg,image/png,image/webp"
onChange={handleBannerFileChange}
className="hidden"
/>
<button
type="button"
disabled={uploadingBanner}
onClick={() => bannerInputRef.current?.click()}
className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow inline-flex items-center justify-center gap-2 shrink-0"
style={{ backgroundColor: draft.accent_color }}
>
<Upload className="w-4 h-4" />
<span>{uploadingBanner ? 'Mengunggah Banner...' : 'Upload Banner dari Perangkat'}</span>
</button>
<input
type="url"
value={draft.banner_url || ''}
onChange={(e) => setDraft({ ...draft, banner_url: e.target.value })}
placeholder="Atau tempel URL gambar banner (https://...)"
className={⁠flex-1 px-3.5 py-2.5 rounded-xl border text-xs outline-none ${ isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200' }⁠}
/>
</div>
</div>
</div>
{/* Nama & Logo */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div>
<label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
Nama Brand / Website
</label>
<input
type="text"
value={draft.site_name}
onChange={(e) => setDraft({ ...draft, site_name: e.target.value })}
className={⁠w-full px-4 py-2.5 rounded-xl border text-sm font-bold outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
/>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
URL Logo Website (Opsional)
</label>
<input
type="url"
value={draft.logo_url}
onChange={(e) => setDraft({ ...draft, logo_url: e.target.value })}
placeholder="https://..."
className={⁠w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
/>
</div>
</div>
{/* Pilihan 4 Tema Latar Belakang */}
<div className="space-y-2.5">
<label className="block text-xs font-bold uppercase tracking-wider">
Tema Latar Belakang (4 Pilihan Resmi)
</label>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
{themes.map((t) => {
const active = draft.theme === t.id;
return (
<button
type="button"
key={t.id}
onClick={() => setDraft({ ...draft, theme: t.id })}
className={⁠p-4 rounded-2xl border text-left transition flex items-start gap-3 ${ active ? 'ring-2 ring-offset-2 dark:ring-offset-slate-900' : isDark ? 'bg-slate-800/70 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100' }⁠}
style={active ? { borderColor: draft.accent_color } : undefined}
>
<div className={⁠w-10 h-10 rounded-xl bg-gradient-to-br ${t.swatch} shrink-0 shadow⁠} />
<div>
<p className="text-xs sm:text-sm font-extrabold">{t.id}</p>
<p className="text-[11px] opacity-70 mt-0.5">{t.desc}</p>
</div>
</button>
);
})}
</div>
</div>
{/* Mode Terang/Gelap, Warna Aksen, Tata Letak Kartu */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
<div>
<label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
Mode Tampilan
</label>
<select
value={draft.appearance_mode}
onChange={(e) => setDraft({ ...draft, appearance_mode: e.target.value as AppearanceMode })}
className={⁠w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
>
<option value="light">Mode Terang (Light)</option>
<option value="dark">Mode Gelap (Dark)</option>
</select>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
Tampilan Kartu Produk
</label>
<select
value={draft.card_layout}
onChange={(e) => setDraft({ ...draft, card_layout: e.target.value as CardLayout })}
className={⁠w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none ${ isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
>
<option value="comfortable">Lega (3 Kolom)</option>
<option value="compact">Ringkas (4 Kolom)</option>
</select>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
Warna Aksen Utama
</label>
<div className="flex items-center gap-2">
<input
type="color"
value={draft.accent_color}
onChange={(e) => setDraft({ ...draft, accent_color: e.target.value })}
className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
/>
<div className="flex flex-wrap gap-1.5">
{accentPresets.map((hex) => (
<button
key={hex}
type="button"
onClick={() => setDraft({ ...draft, accent_color: hex })}
className="w-6 h-6 rounded-full border border-white shadow-sm"
style={{ backgroundColor: hex }}
/>
))}
</div>
</div>
</div>
</div>
{/* Pengaturan Kunci Password Katalog Bersama */}
<div
className={⁠p-4 rounded-2xl border flex items-center justify-between gap-4 ${ isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
>
<div>
<p className="text-xs sm:text-sm font-extrabold">Proteksi Kata Sandi Katalog Pembeli</p>
<p className="text-xs opacity-70 mt-0.5">
Jika aktif, pengunjung wajib memasukkan kata sandi katalog (diverifikasi via server Netlify) sebelum melihat daftar produk.
</p>
</div>
<input
type="checkbox"
checked={draft.catalog_password_enabled}
onChange={(e) => setDraft({ ...draft, catalog_password_enabled: e.target.checked })}
className="w-5 h-5 accent-indigo-600 shrink-0 cursor-pointer"
/>
</div>
<div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
<button
type="button"
onClick={handleResetSettings}
disabled={saving}
className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs sm:text-sm font-bold flex items-center gap-2 transition"
>
<RotateCcw className="w-4 h-4" />
<span>RESET PENGATURAN</span>
</button>
<button
type="submit"
disabled={saving || uploadingBanner}
className="px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-white shadow-lg hover:opacity-95 transition flex items-center gap-2"
style={{ backgroundColor: draft.accent_color }}
>
<Save className="w-4 h-4" />
<span>{saving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}</span>
</button>
</div>
</div>
{/* KOLOM KANAN: LIVE PREVIEW */}
<div
className={⁠rounded-3xl p-6 border flex flex-col justify-between space-y-4 ${ draft.appearance_mode === 'dark' ? 'bg-slate-900 text-slate-100 border-slate-700' : 'bg-white text-slate-800 border-slate-200 shadow-sm' }⁠}
>
<div className="space-y-4">
<span className="text-[11px] font-bold uppercase tracking-widest opacity-60">
Pratinjau Langsung (Preview)
</span>
{draft.banner_url && (
<div className="w-full h-24 rounded-xl overflow-hidden border">
<img src={draft.banner_url} alt="Mini Banner" className="w-full h-full object-cover" />
</div>
)}
<div className="flex items-center gap-3">
<div
className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
style={{ backgroundColor: draft.accent_color }}
>
<BookOpen className="w-5 h-5" />
</div>
<div>
<p className="font-extrabold text-sm">{draft.site_name || 'Rumah Digital'}</p>
<p className="text-[11px] opacity-65">Tema: {draft.theme}</p>
</div>
</div>
<div
className={⁠rounded-2xl p-4 border space-y-3 ${ draft.appearance_mode === 'dark' ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200' }⁠}
>
<span
className="inline-block text-[10px] font-bold px-2 py-0.5 rounded"
style={{ backgroundColor: ⁠${draft.accent_color}20⁠, color: draft.accent_color }}
>
PRODUK BELAJAR ANAK CERDAS
</span>
<p className="font-bold text-sm">Contoh Kartu Produk Digital</p>
<p className="text-xs opacity-70">
Tampilan kontras kartu terjaga optimal di atas latar motif {draft.theme}.
</p>
<div
className="w-full py-2.5 rounded-xl text-center text-xs font-extrabold text-white"
style={{ backgroundColor: draft.accent_color }}
>
BUKA PRODUK
</div>
</div>
</div>
<p className="text-[11px] opacity-60 leading-relaxed">
Klik <strong>SIMPAN PERUBAHAN</strong> untuk menerapkan pengaturan preview ini.
</p>
</div>
</form>
);
};
export default App;
