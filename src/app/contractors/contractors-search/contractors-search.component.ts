import { Component } from '@angular/core';

@Component({
  selector: 'app-contractors-search',
  standalone: true,
  template: `
    <div class="contractors-search">
      <h2>Find Contractors</h2>
      <div class="search-filters">
        <!-- Filters will go here -->
      </div>
      <div class="contractors-list">
        <!-- Contractors list will go here -->
      </div>
    </div>
  `,
  styles: [`
    .contractors-search {
      padding: 2rem;
    }
  `]
})
export class ContractorsSearchComponent {} 