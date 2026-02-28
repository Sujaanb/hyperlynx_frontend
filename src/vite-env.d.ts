/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_HYPERLYNX_API_BASE_URL?: string;
	readonly VITE_SUPABASE_URL?: string;
	readonly VITE_SUPABASE_ANON_KEY?: string;
	readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
	readonly VITE_DEMO_MODE?: string;
	readonly VITE_HARDCODED_DASHBOARD?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
