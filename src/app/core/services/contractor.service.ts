import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getContractor(id: number): Observable<ContractorProfile> {
    return this.http.get<ContractorProfile>(`${this.apiUrl}/${id}`);
  }

  getMyProfile(): Observable<ContractorProfile> {
    return this.http.get<ContractorProfile>(`${this.apiUrl}/me`);
  }

  createProfile(data: CreateContractorProfileDto): Observable<ContractorProfile> {
    return this.http.post<ContractorProfile>(this.apiUrl, data);
  }

  updateProfile(data: UpdateContractorProfileDto): Observable<ContractorProfile> {
    return this.http.patch<ContractorProfile>(`${this.apiUrl}/me`, data);
  }

  deleteProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getContractorById(id: string): Observable<ContractorProfile> {
    return this.http.get<ContractorProfile>(`${this.apiUrl}/${id}`);
  }

  createContractorProfile(profile: Partial<ContractorProfile>): Observable<ContractorProfile> {
    return this.http.post<ContractorProfile>(this.apiUrl, profile);
  }

  updateContractorProfile(id: string, profile: Partial<ContractorProfile>): Observable<ContractorProfile> {
    return this.http.put<ContractorProfile>(`${this.apiUrl}/${id}`, profile);
  }
} 