import { supabase } from './supabase';

/** Elimina tokens de sesión persistidos por Supabase en localStorage. */
export function clearAuthStorage() {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('sb-') && key.includes('auth')) {
      localStorage.removeItem(key);
    }
  }
}

export async function signOutUser() {
  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    // Si falla la red, igual limpiamos localmente
  }
  clearAuthStorage();
}
