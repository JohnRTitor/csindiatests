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
  OPFS_UNAVAILABLE: 'OPFS_UNAVAILABLE',
  DB_OPEN_FAILED: 'DB_OPEN_FAILED',
  MIGRATION_FAILED: 'MIGRATION_FAILED',
  QUERY_ERROR: 'QUERY_ERROR',
  INVALID_ACTION: 'INVALID_ACTION',
  INVALID_PAYLOAD: 'INVALID_PAYLOAD',
  SERIALIZATION_ERROR: 'SERIALIZATION_ERROR',
  WORKER_TERMINATED: 'WORKER_TERMINATED',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN'
} as const;
