const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`/api/v1${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }
  return response.json();
};

export default apiFetch;
