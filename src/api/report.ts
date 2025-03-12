import { apiFetch } from "./api-fetch";

export interface ReportPayload {
  markerId: number;
  reportId: number;
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
