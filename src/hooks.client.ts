import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();

	// Structured logging for client-side diagnostics
	console.error(`[CLIENT_ERROR] [${errorId}] at ${event.url.pathname}`);
	console.error(error);

	return {
		message: status === 404 ? 'Not found' : 'An unexpected error occurred.',
		errorId,
		status
	};
};
