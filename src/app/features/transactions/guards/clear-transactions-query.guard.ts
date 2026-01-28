import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

const LIST_STATE_KEY = 'pf.v1.transactions.listState';
const RETURN_URL_KEY = 'pf.v1.transactions.returnUrl';

@Injectable({ providedIn: 'root' })
export class ClearTransactionsStateGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: unknown,
    currentRoute: any,
    currentState: any,
    nextState: any
  ): boolean {
    const nextUrl: string | undefined = nextState?.url;

    if (!nextUrl) return true;

    // ✅ se ainda está dentro de /transactions (ex: new/edit), não limpa
    if (nextUrl.startsWith('/transactions')) return true;

    // ✅ saindo de /transactions → limpa o estado persistido
    try {
      localStorage.removeItem(LIST_STATE_KEY);
      localStorage.removeItem(RETURN_URL_KEY);
    } catch {
      // ignore
    }

    return true;
  }
}
