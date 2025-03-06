import { searchMarkers } from "@/api/search";
import { useQuery } from "@tanstack/react-query";
import useDebouncedValue from "../use-debounced-value";

const useMarkerSearch = (query: string) => {
  const debouncedQuery = useDebouncedValue(query, 300);

  return useQuery({
    queryKey: ["search-markers", debouncedQuery],
    queryFn: () => searchMarkers(debouncedQuery),
    enabled: Boolean(debouncedQuery),
  });
};

export default useMarkerSearch;
