import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContractorProfile, CreateContractorProfileDto, UpdateContractorProfileDto } from '../models/contractor.models';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  private apiUrl = `${environment.apiUrl}/contractors`;

  constructor(private http: HttpClient) {}

  getContractors(
    search?: string,
    location?: string,
    priceLevels?: number[],
    page: number = 1,
    pageSize: number = 10
  ): Observable<ContractorProfile[] | { items: ContractorProfile[], totalItems: number }> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (location) params = params.set('location', location);
    if (priceLevels?.length) params = params.set('priceLevels', priceLevels.join(','));
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());

    return this.http.get<ContractorProfile[] | { items: ContractorProfile[], totalItems: number }>(`${this.apiUrl}`, { params });
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
    return this.http.patch<ContractorProfile>(`${this.apiUrl}/me`, processedData).pipe(
      // Since the backend returns 204 No Content, we need to fetch the updated profile
      switchMap(() => this.getMyProfile().pipe(
        map(profile => {
          if (!profile) {
            throw new Error('Failed to fetch updated profile');
          }
          return profile;
        })
      )),
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
    // Ensure services is always an array
    if (typeof profile.services === 'string') {
      profile.services = (profile.services as string).split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return profile;
  }

  private processProfileData(data: CreateContractorProfileDto | UpdateContractorProfileDto): any {
    const processedData = { ...data };
    
    // Ensure all required fields are present
    if (!processedData.fullName || !processedData.companyName || !processedData.location || 
        !processedData.bio || !processedData.services || !processedData.priceLevel) {
      throw new Error('All required fields must be provided');
    }

    // Convert to PascalCase and ensure services is a string
    return {
      FullName: processedData.fullName,
      Bio: processedData.bio,
      Services: Array.isArray(processedData.services) 
        ? processedData.services.join(', ')
        : processedData.services,
      Location: processedData.location,
      CompanyName: processedData.companyName,
      PhoneNumber: processedData.phoneNumber || '',
      PriceLevel: typeof processedData.priceLevel === 'string' 
        ? parseInt(processedData.priceLevel, 10)
        : processedData.priceLevel
    };
  }
} 