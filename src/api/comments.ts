import apiFetch from "./api-fetch";

export interface Comment {
  commentId: number;
  markerId: number;
  userId: number;
  commentText: string;
  postedAt: string;
  updatedAt: string;
  username: string;
}

export interface CommentsRes {
  currentPage: number;
  comments: Comment[];
  totalComments: number;
  totalPages: number;
}

export interface AddCommentPayload {
  markerId: number;
  commentText: string;
}

export const fetchComments = async ({
  markerId,
  pageParam,
}: {
  markerId: number;
  pageParam: number;
}): Promise<CommentsRes> => {
  const params = new URLSearchParams({
    page: String(pageParam),
    pageSize: "10",
  });
  return apiFetch(`/comments/${markerId}/comments?${params.toString()}`, {
    credentials: "include",
  });
};

export const addComment = async (body: AddCommentPayload) => {
  return apiFetch(`/comments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const deleteComment = async (id: number) => {
  return apiFetch(`/comments/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
