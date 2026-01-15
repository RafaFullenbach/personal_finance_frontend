export type AppErrorKind =
  | 'validation'
  | 'business'
  | 'notFound'
  | 'unknown'
  | 'timeout';

export interface AppError {
  kind: AppErrorKind;
  message: string;
  code?: string;
  status?: number;
}
