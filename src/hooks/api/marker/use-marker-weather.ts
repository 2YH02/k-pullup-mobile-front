import { fetchMarkerWeather, Weather } from "@/api/marker";
import { useQuery } from "@tanstack/react-query";

export const useMarkerWeather = (lat: number, lng: number) => {
  return useQuery<Weather>({
    queryKey: ["markerWeather", lat, lng],
    queryFn: () => fetchMarkerWeather(lat, lng),
    enabled: Boolean(lat && lng),
  });
};
