const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`/api/v1${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export default apiFetch;
