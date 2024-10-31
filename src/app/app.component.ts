import { Component, PLATFORM_ID, HostListener, Inject } from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatNavList} from '@angular/material/list'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSidenav,
    MatNavList,
    NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'WebSales';

  showButtons = true;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.showButtons = window.innerWidth > 600;
  }
}
