/*
 * Drop-in replacement for the host-provided `window.storage` API.
 *
 * transfer-desk.jsx calls:
 *     await window.storage.get(key, shared)  ->  { value } | null
 *     await window.storage.set(key, value, shared)
 *
 * The original host backed this with a real server, so `shared: true` meant
 * "one board for the whole team". GitHub Pages serves static files only —
 * there is no server — so `shared` is stored in this browser like everything
 * else. Each person therefore has their own board.
 *
 * TO MAKE THE BOARD GENUINELY SHARED LATER: this file is the only thing that
 * has to change. Swap the two bodies below for fetch() calls against a real
 * backend (Cloudflare Worker + KV, Supabase, Firebase, …) and keep the same
 * async shape. Nothing in transfer-desk.jsx needs touching.
 */

const NS = "td";
const scopedKey = (key, shared) => `${NS}:${shared ? "shared" : "local"}:${key}`;

// Private mode / disabled storage must not crash the app, so probe once.
const available = (() => {
  try {
    const probe = `${NS}:probe`;
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
})();

// Fallback for when localStorage is blocked: the app runs, but forgets on reload.
const memory = new Map();

const storage = {
  async get(key, shared = false) {
    const k = scopedKey(key, shared);
    try {
      const value = available ? window.localStorage.getItem(k) : memory.get(k) ?? null;
      return value == null ? null : { value };
    } catch {
      return null;
    }
  },

  async set(key, value, shared = false) {
    const k = scopedKey(key, shared);
    try {
      if (available) window.localStorage.setItem(k, value);
      else memory.set(k, value);
      return true;
    } catch {
      // Quota exceeded, or storage blocked mid-session. Keep the session alive.
      memory.set(k, value);
      return false;
    }
  },
};

export function installStorage() {
  if (!window.storage) window.storage = storage;
  return storage;
}

export { available as storageAvailable };
