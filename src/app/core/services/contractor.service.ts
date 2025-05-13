import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContractorProfile, CreateContractorProfileDto, UpdateContractorProfileDto } from '../models/contractor.models';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  private apiUrl = `${environment.apiUrl}/contractors`;

  constructor(private http: HttpClient) {}

  getContractors(service?: string, location?: string): Observable<ContractorProfile[]> {
    let url = this.apiUrl;
    const params = new URLSearchParams();
    if (service) params.append('service', service);
    if (location) params.append('location', location);
    if (params.toString()) url += `?${params.toString()}`;
    return this.http.get<ContractorProfile[]>(url);
  }

  getContractor(id: string): Observable<ContractorProfile> {
    return this.http.get<ContractorProfile>(`${this.apiUrl}/${id}`);
  }

  getMyProfile(): Observable<ContractorProfile | null> {
    return this.http.get<ContractorProfile>(`${this.apiUrl}/me`).pipe(
      map(profile => this.processProfile(profile)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Return null if profile doesn't exist
          return of(null);
        }
        console.error('Error fetching profile:', error);
        throw error;
      })
    );
  }

  createProfile(data: CreateContractorProfileDto): Observable<ContractorProfile> {
    const processedData = this.processProfileData(data);
    return this.http.post<ContractorProfile>(this.apiUrl, processedData).pipe(
      map(profile => this.processProfile(profile)),
      catchError(error => {
        console.error('Error creating profile:', error);
        throw error;
      })
    );
  }

  updateProfile(data: UpdateContractorProfileDto): Observable<ContractorProfile> {
    const processedData = this.processProfileData(data);
    return this.http.put<ContractorProfile>(`${this.apiUrl}/me`, processedData).pipe(
      map(profile => this.processProfile(profile)),
      catchError(error => {
        console.error('Error updating profile:', error);
        throw error;
      })
    );
  }

  deleteProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getContractorById(id: string): Observable<ContractorProfile> {
    return this.http.get<ContractorProfile>(`${this.apiUrl}/${id}`).pipe(
      map(profile => this.processProfile(profile)),
      catchError(error => {
        console.error('Error fetching contractor:', error);
        throw error;
      })
    );
  }

  createContractorProfile(profile: Partial<ContractorProfile>): Observable<ContractorProfile> {
    return this.http.post<ContractorProfile>(this.apiUrl, profile);
  }

  updateContractorProfile(id: string, profile: Partial<ContractorProfile>): Observable<ContractorProfile> {
    return this.http.put<ContractorProfile>(`${this.apiUrl}/${id}`, profile);
  }

  private processProfile(profile: ContractorProfile): ContractorProfile {
    if (typeof profile.services === 'string') {
      profile.services = (profile.services as string).split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return profile;
  }

  private processProfileData(data: CreateContractorProfileDto | UpdateContractorProfileDto): any {
    const processedData = { ...data };
    if (Array.isArray(processedData.services)) {
      processedData.services = (processedData.services as string[]).join(', ');
    }
    return processedData;
  }
} 