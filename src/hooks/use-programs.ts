import { useQuery } from "@tanstack/react-query";
import { fetchPublicPrograms } from "@/api/programs";
import { PublicProgram } from "@/types/programs";

export const usePublicPrograms = (limit?: number) => {
  return useQuery<PublicProgram[]>({
    queryKey: ["public-programs", { limit }],
    queryFn: () => fetchPublicPrograms(limit),
  });
};
