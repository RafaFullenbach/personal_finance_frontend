import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type PfVariant = 'flat' | 'stroked' | 'basic';
type PfColor = 'primary' | 'accent' | 'warn';

@Component({
  selector: 'pf-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, NgIf],
  templateUrl: './pf-button.component.html',
})
export class PfButtonComponent {
  @Input() label?: string;

  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';

  @Input() variant: PfVariant = 'flat';
  @Input() color: PfColor | undefined = 'primary';

  @Input() type: 'button' | 'submit' = 'button';

  @Input() disabled = false;
  @Input() loading = false;

  // permite usar [routerLink] quando for navegação
  @Input() routerLink?: any[] | string;

  // tamanhos padronizados pro app
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  get sizeClass(): string {
    switch (this.size) {
      case 'sm':
        return '!rounded-lg !py-2 !px-4';
      case 'lg':
        return '!rounded-lg !py-3 !px-6';
      default:
        return '!rounded-lg !py-2.5 !px-5';
    }
  }

  get labelClass(): string {
    switch (this.size) {
      case 'sm':
        return 'text-xl font-medium leading-none';
      case 'lg':
        return 'text-2xl font-medium leading-none';
      default:
        return 'text-2xl font-medium leading-none';
    }
  }
}
