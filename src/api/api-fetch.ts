interface ReturnOption {
  returnType: "text" | "json";
}

export interface InfiniteMarkerRes<T> {
  currentPage: number;
  markers: T[];
  totalMarkers: number;
  totalPages: number;
}

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  returnOption?: ReturnOption
) => {
  const response = await fetch(`/api/v1${endpoint}`, {
    headers: {
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }
  if (returnOption) {
    if (returnOption.returnType === "text") {
      return response.text();
    }
  }
  return response.json();
};

export const apiServerFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
    {
      headers: {
        ...options.headers,
      },
      ...options,
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }
  return response.json();
};
