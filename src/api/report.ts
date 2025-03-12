import { apiFetch } from "./api-fetch";

export interface ReportPayload {
  markerId: number;
  reportId: number;
}

export interface SubmitReportPayload {
  markerId: number;
  latitude: number;
  longitude: number;
  newLatitude?: number;
  newLongitude?: number;
  photos: File[];
  description: string;
}

export const deleteReport = async ({ markerId, reportId }: ReportPayload) => {
  return await apiFetch(
    `/reports?markerID=${markerId}&reportID=${reportId}`,
    {
      method: "DELETE",
      cache: "no-store",
      credentials: "include",
    },
    { returnType: "text" }
  );
};

export const denyReport = async (reportId: number) => {
  return await apiFetch(
    `/reports/deny/${reportId}`,
    {
      method: "POST",
      cache: "no-store",
      credentials: "include",
    },
    { returnType: "text" }
  );
};

export const approveReport = async (reportId: number) => {
  return await apiFetch(
    `/reports/approve/${reportId}`,
    {
      method: "POST",
      cache: "no-store",
      credentials: "include",
    },
    { returnType: "text" }
  );
};

export const reportMarker = async (multipart: SubmitReportPayload) => {
  const formData = new FormData();

  for (let i = 0; i < multipart.photos.length; i++) {
    formData.append("photos", multipart.photos[i]);
  }

  formData.append("markerId", multipart.markerId.toString());
  formData.append("latitude", multipart.latitude.toString());
  formData.append("longitude", multipart.longitude.toString());

  if (multipart.newLatitude && multipart.newLongitude) {
    formData.append("newLatitude", multipart.newLatitude.toString());
    formData.append("newLongitude", multipart.newLongitude.toString());
  }

  formData.append("description", multipart.description);

  return await apiFetch(`/reports`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
};
