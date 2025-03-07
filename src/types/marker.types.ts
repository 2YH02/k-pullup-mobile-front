export interface Photo {
  uploadedAt: string;
  photoId: number;
  markerId: number;
  photoUrl: string;
  thumbnailUrl: string;
}

export interface MarkerDetail {
  markerId: number;
  userId: number | null;
  latitude: number;
  longitude: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  photos?: Photo[];
  dislikeCount?: number;
  disliked: boolean;
  addr?: string;
  isChulbong?: boolean;
  favorited?: boolean;
  address?: string;
  favCount?: number;
  hasPhoto?: boolean;
  error?: string;
}
