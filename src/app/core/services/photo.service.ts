import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PhotoType } from '../models/contractor.models';
import { map } from 'rxjs/operators';

export interface Photo {
  id: number;
  type: number;
  fileName: string;
  uploadedAt: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = `${environment.apiUrl}/contractors`;

  constructor(private http: HttpClient) {}

  getContractorPhotos(contractorId: number): Observable<Photo[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${contractorId}/photos`).pipe(
      map(photos => photos.map(photo => ({
        ...photo,
        url: `${this.apiUrl}/${contractorId}/photos/${photo.id}`
      })))
    );
  }

  getContractorPhoto(contractorId: number, photoId: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.apiUrl}/${contractorId}/photos/${photoId}`);
  }

  uploadPhoto(file: File, type: PhotoType): Observable<Photo> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(`${this.apiUrl}/me/photos?type=${type}`, formData);
  }

  deletePhoto(photoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me/photos/${photoId}`);
  }
} 