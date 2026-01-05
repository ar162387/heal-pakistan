import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { fetchPublicAlumni } from "@/api/alumni";
import { PublicAlumniProfile } from "@/types/alumni";

const Alumni = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-alumni", searchTerm, selectedUniversity, selectedBatch],
    queryFn: () =>
      fetchPublicAlumni({
        search: searchTerm,
        university: selectedUniversity ?? null,
        batch: selectedBatch ?? null,
        limit: 200,
      }),
  });

  const alumni: PublicAlumniProfile[] = data ?? [];

  const universities = useMemo(() => {
    const values = new Set<string>();
    alumni.forEach((item) => values.add(item.university));
    return ["All Universities", ...Array.from(values)];
  }, [alumni]);

  const batches = useMemo(() => {
    const values = new Set<string>();
    alumni.forEach((item) => values.add(item.batch));
    return ["All Batches", ...Array.from(values)];
  }, [alumni]);

  const filteredAlumni = alumni;

  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Internship Alumni
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Meet our growing family of interns who have contributed to HEAL Pakistan's mission.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="bg-card p-6 rounded-lg shadow-md mb-10">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedUniversity ?? "All Universities"}
                onValueChange={(value) => setSelectedUniversity(value === "All Universities" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedBatch ?? "All Batches"}
                onValueChange={(value) => setSelectedBatch(value === "All Batches" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Alumni Grid */}
          {isLoading && <p className="text-center text-muted-foreground py-12">Loading alumni...</p>}
          {isError && <p className="text-center text-destructive py-12">Failed to load alumni.</p>}

          {!isLoading && !isError && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {filteredAlumni.map((alumni) => (
                  <div key={alumni.id} className="bg-card p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                    {alumni.profile_photo_url && (
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-4 border-primary/20">
                        <img src={alumni.profile_photo_url} alt={alumni.full_name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h3 className="font-medium text-foreground text-sm mb-1">{alumni.full_name}</h3>
                    <p className="text-xs text-muted-foreground">{alumni.university}</p>
                    <p className="text-xs text-primary">Batch {alumni.batch}</p>
                  </div>
                ))}
              </div>

              {filteredAlumni.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No alumni found matching your criteria.</p>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Alumni;
