import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AuthUser } from '../../models/auth-user.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionComponent } from '../../components/shared/subscription.component';
import { MatButtonModule } from '@angular/material/button';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { curveMonotoneX } from 'd3-shape';
import { multi, lineData, pieData, curvedLineData } from './data';
import { TranslationService } from '../../services/translation.service';
import { LayoutComponent } from '../../components/layout/layout.component';
import { UsersService } from '../../services/users.service';
import { UserModel } from '../../models/users.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    TranslateModule,
    MatButtonModule,
    NgxChartsModule
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private subscription = new Subscription;

  user: UserModel | null = null;

  constructor(public translationService: TranslationService) { }

  ngOnInit(): void {
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translationService.loadTranslations(selectedLang);

    this.translationService.currentLanguage$.subscribe(lang => {
    });

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  multi = [...multi];
  lineData = [...lineData];
  pieData = [...pieData];
  curvedLineData = [...curvedLineData];

  view: [number, number] = [600, 400];

  // chart options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
  legendTitle = 'Years';
  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00aa4f', '#c9ffce', '#ffaaaa']
  };

  curve = curveMonotoneX;

  onSelect(event: any) { }

}
