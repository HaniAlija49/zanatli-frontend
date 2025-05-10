import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contractor-detail',
  standalone: true,
  template: `
    <div class="contractor-detail">
      <h2>Contractor Details</h2>
      <div class="contractor-info">
        <!-- Contractor details will go here -->
      </div>
    </div>
  `,
  styles: [`
    .contractor-detail {
      padding: 2rem;
    }
  `]
})
export class ContractorDetailComponent {
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      console.log('Contractor ID:', params['id']);
    });
  }
} 