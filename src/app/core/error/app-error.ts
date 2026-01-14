export type AppError =
  | { kind: 'validation'; message: string; code?: string | null }
  | { kind: 'notFound'; message: string }
  | { kind: 'business'; message: string; code?: string | null }
  | { kind: 'timeout'; message: string }
  | { kind: 'unknown'; message: string };
