import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-role-toggle',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule],
  template: `
    <mat-button-toggle-group
      *ngIf="(roles || []).length > 1"
      [value]="activeRole"
      (change)="onRoleChange($event.value)"
      class="role-toggle-group"
      aria-label="Role toggle"
      >
      <mat-button-toggle value="client">Client</mat-button-toggle>
      <mat-button-toggle value="contractor">Contractor</mat-button-toggle>
    </mat-button-toggle-group>
  `,
  styles: [`
    .role-toggle-group {
      margin-left: 1rem;
      background: #f5faff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.04);
      padding: 0.2rem 0.5rem;
    }
    mat-button-toggle {
      font-weight: 600;
      font-size: 1rem;
      color: #1976d2;
    }
    mat-button-toggle.mat-button-toggle-checked {
      background: #1976d2;
      color: #fff;
    }
  `]
})
export class RoleToggleComponent {
  @Input() roles: string[] = [];
  @Input() activeRole: string = '';
  @Output() roleChange = new EventEmitter<string>();

  onRoleChange(role: string) {
    this.roleChange.emit(role);
  }
} 