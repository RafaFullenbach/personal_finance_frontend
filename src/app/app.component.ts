import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen">
      <router-outlet />
    </div>
  `,
})
export class AppComponent {
  private theme = inject(ThemeService);

  ngOnInit(): void {
    this.theme.init();
  }
}
