import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { UserModel } from '../../models/users.model';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    SidebarComponent,
    HeaderComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  private usersService = inject(UsersService);

  @ViewChild('sidenav') sidenav!: MatSidenav;

  user!: UserModel;
  sidenavOpened = true;
  public currentYear: number = new Date().getFullYear();

  constructor() {
    const loggedUser = sessionStorage.getItem('email');

    if (loggedUser) {
      this.usersService.getUserByEmail(loggedUser).subscribe({
        next: (response) => {
          this.user = response[0];
        },
        error: () => {
        },
      });
    }
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'it';
  }

  onToggleSidebar() {
    this.sidenav.toggle();
  }
}
