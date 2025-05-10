export interface CreateJobRequestDto {
  contractorId: string;
  description: string;
  preferredDate: Date;
}

export interface UpdateJobResponseDto {
  responseMessage: string;
}

export interface Job {
  id: number;
  contractorId: string;
  clientId: string;
  description: string;
  preferredDate: Date;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum JobStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
  Completed = 'Completed'
} 