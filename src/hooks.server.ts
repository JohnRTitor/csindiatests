import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();

	// Structured logging for developer diagnostics
	console.error(`[SERVER_ERROR] [${errorId}] ${event.request.method} ${event.url.pathname}`);
	console.error(error);

	return {
		message: status === 404 ? 'Not found' : 'An unexpected error occurred.',
		errorId,
		status
	};
};
