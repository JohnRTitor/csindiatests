import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  // Required for SharedArrayBuffer, which is needed by SQLite WASM OPFS VFS.
  // Without these headers, the browser will not allow cross-origin isolation,
  // and OPFS synchronous access handles will be unavailable.
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

  return response;
};
