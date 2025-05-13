export interface CreateContractorProfileDto {
  fullName: string;
  bio: string;
  services: string[];
  location: string;
  companyName: string;
}

export interface UpdateContractorProfileDto {
  fullName?: string;
  bio?: string;
  services?: string[];
  location?: string;
  companyName?: string;
}

export interface ContractorProfile {
  id: number;
  fullName: string;
  bio: string;
  services: string[];
  location: string;
  companyName: string;
  userId: string;
  email: string;
  profileImage?: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
}

export enum PhotoType {
  Profile = 0,
  Portfolio = 1
} 