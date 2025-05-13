export interface JobDetails {
  id: string | number;
  description: string;
  status: number | string;
  preferredDate: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  declineReason?: string;
  responseMessage?: string;
  client?: {
    id: string;
    fullName?: string;
    email?: string;
    phone?: string;
  };
  contractor?: {
    id: string;
    fullName?: string;
    email?: string;
    phone?: string;
  };
  // Add any other fields you want to display
} 