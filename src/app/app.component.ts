import { Component, PLATFORM_ID, HostListener, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { Route, Router, RouterLink, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatNavList} from '@angular/material/list'; 
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { UserNotloggedDialogComponent } from './snack-bar/user-notlogged-dialog/user-notlogged-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import { LogoutDialogComponent } from './logout/logout-dialog/logout-dialog.component';

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
    NgIf,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit{
  title = 'WebSales';
  logged = false;
  userId!: number | null;

  showButtons = true;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog,
    private auth: AuthService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  ngOnInit(): void {
    this.userId = this.auth.getUserIdFromStorage();

    this.auth.isLoggedIn$.subscribe(isLoggedIn => {
      this.logged = isLoggedIn;
      console.log('Logged status updated:', this.logged);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.showButtons = window.innerWidth > 600;
  }

  handleNavigation(route: string, id: number | null = null) {
    if(this.logged == false){
      this.dialog.open(UserNotloggedDialogComponent);
    }
    else{
      if(id){
        this.router.navigate([route, id]);
      }
      else{
        this.router.navigate([route]);
      }
    }
  }

  logout(){
    this.dialog.open(LogoutDialogComponent);
  }
}
