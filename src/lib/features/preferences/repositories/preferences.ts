import { db } from '$lib/infrastructure/storage/database';

export const preferencesRepo = {
  async get(key: string): Promise<unknown | null> {
    const pref = await db.preferences.get(key);
    return pref ? pref.value : null;
  },

  async getAll(): Promise<Record<string, unknown>> {
    const prefs = await db.preferences.toArray();
    return prefs.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, unknown>);
  },

  async set(key: string, value: unknown): Promise<void> {
    await db.preferences.put({
      key,
      value,
      updatedAt: new Date().toISOString()
    });
  },

  async setBulk(entries: Record<string, unknown>): Promise<void> {
    const now = new Date().toISOString();
    const prefsToPut = Object.entries(entries).map(([key, value]) => ({
      key,
      value,
      updatedAt: now
    }));
    await db.preferences.bulkPut(prefsToPut);
  },

  async delete(key: string): Promise<void> {
    await db.preferences.delete(key);
  }
};
