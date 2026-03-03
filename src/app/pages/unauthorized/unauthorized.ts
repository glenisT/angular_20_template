import { Component, inject, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { UsersService } from '../../services/users.service';
import { UserModel } from '../../models/users.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.scss',
})
export class Unauthorized implements OnInit {
  private usersService = inject(UsersService);
  private subscription = new Subscription;

  user!: UserModel;

  constructor(public translationService: TranslationService) { }

  ngOnInit(): void {
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translationService.loadTranslations(selectedLang);

    this.translationService.currentLanguage$.subscribe(lang => { });

    const loggedUser = sessionStorage.getItem('email');

    if (loggedUser) {
      const sub = this.usersService.getUserByEmail(loggedUser).subscribe({
        next: (response) => {
          this.user = response[0];
        },
        error: () => {
        },
      });

      this.subscription.add(sub);
    }
  }
}
