export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  jobId: number;
  client: {
    id: string;
    email: string;
  };
}

export interface CreateReviewDto {
  rating: number;
  comment?: string;
}

export type ReviewResponse = Review[]; 