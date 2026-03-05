import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
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
export class SidebarComponent implements OnInit {
  private router = inject(Router);

  @Input() user: UserModel | null = null;

  constructor(public translationService: TranslationService) { }

  ngOnInit(): void {
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translationService.loadTranslations(selectedLang);

    this.translationService.currentLanguage$.subscribe(lang => { });
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

  goToHome() {
    this.navigate('/home');
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
