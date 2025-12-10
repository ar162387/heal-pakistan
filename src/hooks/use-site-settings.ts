import { useQuery } from "@tanstack/react-query";
import { fetchSiteSettings } from "@/api/settings";

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
  });
};
