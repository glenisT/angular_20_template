import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export interface CategoryAuthority {
  category: string;
  authorities: string[];
  allSelected: boolean;
  someSelected: boolean;
}

@Component({
  selector: 'app-hierarchical-authority-select',
  imports: [
    MatCheckboxModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, //Improves performance, Angular will only re-render the component when directly modified by user
  templateUrl: './hierarchical-authority-select.component.html',
  styleUrl: './hierarchical-authority-select.component.scss'
})
export class HierarchicalAuthoritySelectComponent implements OnInit, OnChanges {
  @Input() authoritiesByCategory: { [category: string]: string[] } = {};
  @Input() control: FormControl = new FormControl([], Validators.required);
  @Input() placeholder: string = '';
  @Output() selectedOptionsChange = new EventEmitter<string[]>();

  categories: CategoryAuthority[] = [];
  expandedCategories: Set<string> = new Set();
  protected translate = inject(TranslateService);

  ngOnInit(): void {
    this.initializeCategories();
    this.updateCategoryStates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['authoritiesByCategory'] && !changes['authoritiesByCategory'].firstChange) {
      this.initializeCategories();
      this.updateCategoryStates();
    }
    if (changes['control'] && !changes['control'].firstChange) {
      this.updateCategoryStates();
    }
  }

  private initializeCategories(): void {
    this.categories = Object.keys(this.authoritiesByCategory).map(category => ({
      category,
      authorities: this.authoritiesByCategory[category],
      allSelected: false,
      someSelected: false
    }));

    // Espandi tutte le categorie di default
    this.expandedCategories = new Set(this.categories.map(c => c.category));
  }

  private updateCategoryStates(): void {
    const selectedAuthorities = this.control.value || [];

    this.categories.forEach(category => {
      const categoryAuthorities = category.authorities;
      const selectedInCategory = categoryAuthorities.filter(auth =>
        selectedAuthorities.includes(auth)
      );

      category.allSelected = selectedInCategory.length === categoryAuthorities.length && categoryAuthorities.length > 0;
      category.someSelected = selectedInCategory.length > 0 && selectedInCategory.length < categoryAuthorities.length;
    });
  }

  toggleCategory(category: string): void {
    if (this.expandedCategories.has(category)) {
      this.expandedCategories.delete(category);
    } else {
      this.expandedCategories.add(category);
    }
  }

  isCategoryExpanded(category: string): boolean {
    return this.expandedCategories.has(category);
  }

  onCategoryToggle(category: CategoryAuthority): void {
    const selectedAuthorities = [...(this.control.value || [])];
    const categoryAuthorities = category.authorities;

    if (category.allSelected) {
      // Deseleziona tutte le authorities della categoria
      categoryAuthorities.forEach(auth => {
        const index = selectedAuthorities.indexOf(auth);
        if (index > -1) {
          selectedAuthorities.splice(index, 1);
        }
      });
    } else {
      // Seleziona tutte le authorities della categoria
      categoryAuthorities.forEach(auth => {
        if (!selectedAuthorities.includes(auth)) {
          selectedAuthorities.push(auth);
        }
      });
    }

    this.control.setValue(selectedAuthorities);
    this.updateCategoryStates();
    this.selectedOptionsChange.emit(selectedAuthorities);
  }

  onAuthorityToggle(authority: string, category: CategoryAuthority): void {
    const selectedAuthorities = [...(this.control.value || [])];
    const index = selectedAuthorities.indexOf(authority);

    if (index > -1) {
      selectedAuthorities.splice(index, 1);
    } else {
      selectedAuthorities.push(authority);
    }

    this.control.setValue(selectedAuthorities);
    this.updateCategoryStates();
    this.selectedOptionsChange.emit(selectedAuthorities);
  }

  isAuthoritySelected(authority: string): boolean {
    const selectedAuthorities = this.control.value || [];
    return selectedAuthorities.includes(authority);
  }

  getSelectedCount(): number {
    return (this.control.value || []).length;
  }

  getTotalCount(): number {
    return this.categories.reduce((total, cat) => total + cat.authorities.length, 0);
  }

  formatCategoryKey(key: string): string {
    if (!key) return '';
    const keyLabel = 'AUTHORITIES.KEYS.' + key;
    const translated = this.translate.instant(keyLabel);
    return translated !== keyLabel ? translated : key.replace(/_/g, ' ');
  }
}

