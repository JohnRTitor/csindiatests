export class DatabaseError extends Error {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
  }
}

export const ErrorCodes = {
  INIT_FAILED: 'INIT_FAILED',
  IDB_UNAVAILABLE: 'IDB_UNAVAILABLE',
  DB_OPEN_FAILED: 'DB_OPEN_FAILED',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  QUERY_ERROR: 'QUERY_ERROR',
  UNKNOWN: 'UNKNOWN'
} as const;
