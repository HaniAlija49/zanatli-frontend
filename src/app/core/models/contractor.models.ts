export interface CreateContractorProfileDto {
  fullName: string;
  bio: string;
  services: string;
  location: string;
  companyName: string;
}

export interface UpdateContractorProfileDto {
  fullName: string;
  bio: string;
  services: string;
  location: string;
  companyName: string;
}

export interface ContractorProfile extends CreateContractorProfileDto {
  id: number;
  userId: string;
}

export enum PhotoType {
  Profile = 0,
  Portfolio = 1
} 