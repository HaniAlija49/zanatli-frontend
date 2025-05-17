export interface Message {
  id: number;
  text: string;
  sender: {
    id: string;
    email: string;
  };
  createdAt: string;
}

export interface CreateMessageDto {
  text: string;
} 