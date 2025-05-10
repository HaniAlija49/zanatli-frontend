export interface CreateJobRequestDto {
  contractorId: string;
  description: string;
  preferredDate: Date;
}

export interface UpdateJobResponseDto {
  responseMessage: string;
}

export interface Job {
  id: string;
  description: string;
  status: JobStatus;
  preferredDate: Date;
  createdAt: Date;
  updatedAt: Date;
  clientId: string;
  contractorId: string;
  client?: {
    id: string;
    fullName: string;
  };
  contractor?: {
    id: string;
    fullName: string;
  };
}

export enum JobStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface CreateJobDto {
  description: string;
  preferredDate: Date;
  contractorId: string;
}

export interface UpdateJobDto {
  description?: string;
  preferredDate?: Date;
  status?: JobStatus;
} 