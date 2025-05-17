import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContractorProfile, CreateContractorProfileDto, UpdateContractorProfileDto } from '../models/contractor.models';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  private apiUrl = `${environment.apiUrl}/contractors`;

  constructor(private http: HttpClient) {}

  getContractors(service?: string, location?: string, priceLevels?: number[]): Observable<ContractorProfile[]> {
    let url = this.apiUrl;
    const params = new URLSearchParams();
    if (service) params.append('service', service);
    if (location) params.append('location', location);
    if (priceLevels && priceLevels.length > 0) {
      priceLevels.forEach(level => params.append('priceLevels', level.toString()));
    }
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