import { apiFetch } from "./api-fetch";

export interface Moment {
  address: string;
  blurhash: string;
  caption: string;
  createdAt: string;
  expiresAt: string;
  markerID: number;
  photoURL: string;
  storyID: number;
  thumbsDown?: number;
  thumbsUp?: number;
  userLiked?: boolean;
  userID: number;
  username: string;
}

export interface PostMomentPayload {
  markerId: number;
  photo: File;
  caption: string;
}

export const postMoment = async (body: PostMomentPayload): Promise<Moment> => {
  const formData = new FormData();

  formData.append("caption", body.caption);
  formData.append("photo", body.photo);

  return await apiFetch(`/markers/${body.markerId}/stories`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    body: formData,
  });
};

export const fetchMomentForMarker = async (
  markerId: number
): Promise<Moment[]> => {
  return await apiFetch(`/markers/${markerId}/stories`);
};

export const deleteMoment = async (markerId: number, momentId: number) => {
  return await apiFetch(
    `/markers/${markerId}/stories/${momentId}`,
    {
      method: "DELETE",
      credentials: "include",
      cache: "no-store",
    },
    { returnType: "text" }
  );
};

export const addToMomentFavorite = async (storyId: number) => {
  return await apiFetch(`/markers/stories/${storyId}/reactions`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reactionType: "thumbsup" }),
  });
};

export const removeMomentFavorite = async (storyId: number) => {
  return await apiFetch(
    `/markers/stories/${storyId}/reactions`,
    {
      method: "DELETE",
      credentials: "include",
      cache: "no-store",
    },
    { returnType: "text" }
  );
};

export const getAllMoment = async (): Promise<Moment[]> => {
  return await apiFetch(`/markers/stories`, {
    cache: "no-store",
  });
};
