export interface CreateContractorProfileDto {
  fullName: string;
  bio: string;
  services: string[];
  location: string;
  companyName: string;
  priceLevel: number;
  phoneNumber?: string;
}

export interface UpdateContractorProfileDto {
  fullName?: string;
  bio?: string;
  services?: string[];
  location?: string;
  companyName?: string;
  priceLevel?: number;
  phoneNumber?: string;
}

export interface ContractorProfile {
  id: number;
  userId: string;
  fullName: string;
  companyName: string;
  location: string;
  bio: string;
  services: string[];
  priceLevel: number;
  phoneNumber?: string;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export enum PhotoType {
  Profile = 0,
  Portfolio = 1
} 