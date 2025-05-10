import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ContractorProfile, CreateContractorProfileDto, UpdateContractorProfileDto } from '../models/contractor.models';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  constructor(private api: ApiService) {}

  getContractors(service?: string, location?: string): Observable<ContractorProfile[]> {
    let url = '/contractors';
    const params = new URLSearchParams();
    if (service) params.append('service', service);
    if (location) params.append('location', location);
    if (params.toString()) url += `?${params.toString()}`;
    return this.api.get<ContractorProfile[]>(url);
  }

  getContractor(id: number): Observable<ContractorProfile> {
    return this.api.get<ContractorProfile>(`/contractors/${id}`);
  }

  getMyProfile(): Observable<ContractorProfile> {
    return this.api.get<ContractorProfile>('/contractors/me');
  }

  createProfile(data: CreateContractorProfileDto): Observable<ContractorProfile> {
    return this.api.post<ContractorProfile>('/contractors', data);
  }

  updateProfile(data: UpdateContractorProfileDto): Observable<ContractorProfile> {
    return this.api.patch<ContractorProfile>('/contractors/me', data);
  }

  deleteProfile(id: number): Observable<void> {
    return this.api.delete<void>(`/contractors/${id}`);
  }
} 