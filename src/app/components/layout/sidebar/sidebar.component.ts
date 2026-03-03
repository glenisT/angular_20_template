import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../../auth/auth.service';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../../services/translation.service';
import { UserModel } from '../../../models/users.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit{
  private router = inject(Router);

  protected authService = inject(AuthService);

  @Input() user: UserModel | null = null;

  adminMenuOpen = false;
  guideMenuOpen = false;
  userSub!: Subscription;

  constructor(public translationService: TranslationService) { }

  ngOnInit(): void {
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translationService.loadTranslations(selectedLang);

    this.translationService.currentLanguage$.subscribe(lang => {});
  }

  toggleAdminMenu() {
    this.adminMenuOpen = !this.adminMenuOpen;
  }

  toggleGuideMenu() {
    this.guideMenuOpen = !this.guideMenuOpen;
  }

  private navigate(path: string) {
    this.router.navigate([path]);
  }

  goToUsers() {
    this.navigate('/users');
  }

  goToRoles() {
    this.navigate('/roles');
  }

  goToProfiles() {
    this.navigate('/profiles');
  }

  goToHome() {
    this.navigate('/home');
  }

  goToConfiguratio() {
    this.navigate('/admin/settings');
  }

  goToLibraries() {
    this.navigate('/admin/libraries');
  }

  goToColors() {
    this.navigate('/theme/colors');
  }

  goToButtons() {
    this.navigate('/theme/buttons');
  }

  goToTables() {
    this.navigate('/theme/tables');
  }

  goToDatetime() {
    this.navigate('/theme/datetime');
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  /**
   * Controlla se l'utente ha almeno un permesso per vedere la sezione Amministrazione
   */
  // hasAdminPermissions(): boolean {
  //   return this.authService.hasAnyAuthority([
  //     'VIEW_USER',
  //     'VIEW_ROLE',
  //     'VIEW_PROFILE',
  //     'VIEW_ADMIN_SETTINGS',
  //     'VIEW_LIBRARY',
  //   ]);
  // }
}
