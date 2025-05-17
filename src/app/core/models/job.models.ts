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
  responseMessage?: string | null;
  client?: {
    id: string;
    email: string;
  };
  contractor?: {
    id: string;
    email: string;
  };
}

export enum JobStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
  Completed = 'Completed',
}

export interface CreateJobDto {
  description: string;
  preferredDate: string;
  contractorId: string | null;
}

export interface UpdateJobDto {
  description?: string;
  preferredDate?: Date;
  status?: JobStatus;
} 