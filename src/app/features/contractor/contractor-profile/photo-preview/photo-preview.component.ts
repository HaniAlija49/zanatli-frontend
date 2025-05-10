import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-photo-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="photo-preview-container">
      <button mat-icon-button class="close-button" (click)="close()">
        <mat-icon>close</mat-icon>
      </button>
      <div class="image-container">
        <img [src]="data.photoUrl" [alt]="data.photoType + ' photo'" class="preview-image">
      </div>
    </div>
  `,
  styles: [`
    .photo-preview-container {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .close-button {
      position: absolute;
      top: 16px;
      right: 16px;
      color: white;
      z-index: 1;
    }

    .image-container {
      max-width: 90%;
      max-height: 90%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .preview-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  `]
})
export class PhotoPreviewComponent {
  constructor(
    public dialogRef: MatDialogRef<PhotoPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { photoUrl: string; photoType: 'profile' | 'portfolio' }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
} 