import { Component, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslationService } from '../../../services/translation.service';
import { UserModel } from '../../../models/users.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslateModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);

  @Input() user: UserModel | null = null;
  @Output() toggleSidebar = new EventEmitter<void>();

  public currentYear: number = new Date().getFullYear();
  public currentLanguage: string = 'it';

  constructor(public translationService: TranslationService) { }

  ngOnInit() {
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translationService.loadTranslations(selectedLang);

    // Subscribe to language changes and update local property
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  changeLanguage(lang: string) {
    if (this.translationService.currentLanguage === lang) return;
    this.translationService.loadTranslations(lang);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
