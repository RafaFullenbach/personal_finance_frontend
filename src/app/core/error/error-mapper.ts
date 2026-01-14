import { HttpErrorResponse } from '@angular/common/http';
import { AppError } from './app-error';
import { ApiProblemDetails } from './problem-details';

function isApiProblemDetails(x: any): x is ApiProblemDetails {
  return (
    x &&
    typeof x === 'object' &&
    typeof x.status === 'number' &&
    typeof x.detail === 'string' &&
    typeof x.title === 'string'
  );
}

export function mapHttpError(err: unknown): AppError {
  // rxjs timeout
  if (err && typeof err === 'object' && (err as any).name === 'TimeoutError') {
    return { kind: 'timeout', message: 'Tempo limite excedido. Tente novamente.' };
  }

  if (!(err instanceof HttpErrorResponse)) {
    return { kind: 'unknown', message: 'Erro inesperado.' };
  }

  const body = err.error;

  if (isApiProblemDetails(body)) {
    const msg = body.detail ?? body.title ?? 'Erro';

    if (err.status === 400) {
      return { kind: 'validation', message: msg, code: body.code ?? null };
    }

    if (err.status === 404) {
      return { kind: 'notFound', message: msg };
    }

    if (err.status === 409) {
      return { kind: 'business', message: msg, code: body.code ?? null };
    }

    return { kind: 'unknown', message: msg };
  }

  // fallback (quando não veio problem+json)
  if (err.status === 404) return { kind: 'notFound', message: 'Recurso não encontrado.' };

  return { kind: 'unknown', message: 'Falha ao comunicar com o servidor.' };
}
