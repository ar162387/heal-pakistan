import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const alumniData = [
  { name: "Ahmed Khan", university: "NDU Islamabad", batch: "2024", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { name: "Sara Ali", university: "IIUI", batch: "2024", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" },
  { name: "Bilal Ahmed", university: "NUML", batch: "2024", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
  { name: "Fatima Zahra", university: "FJWU", batch: "2023", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
  { name: "Usman Tariq", university: "QAU", batch: "2023", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
  { name: "Ayesha Malik", university: "Iqra University", batch: "2024", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
  { name: "Hassan Raza", university: "NDU Islamabad", batch: "2023", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" },
  { name: "Zainab Iqbal", university: "IIUI", batch: "2023", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" },
  { name: "Ali Hassan", university: "NUML", batch: "2024", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face" },
  { name: "Sana Fatima", university: "FJWU", batch: "2024", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face" },
  { name: "Omar Farooq", university: "QAU", batch: "2024", image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face" },
  { name: "Hira Khan", university: "Iqra University", batch: "2023", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face" },
];

const universities = ["All Universities", "NDU Islamabad", "IIUI", "NUML", "FJWU", "QAU", "Iqra University"];
const batches = ["All Batches", "2024", "2023"];

const Alumni = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("All Universities");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");

  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUniversity = selectedUniversity === "All Universities" || alumni.university === selectedUniversity;
    const matchesBatch = selectedBatch === "All Batches" || alumni.batch === selectedBatch;
    return matchesSearch && matchesUniversity && matchesBatch;
  });

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
              <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredAlumni.map((alumni, index) => (
              <div key={index} className="bg-card p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-4 border-primary/20">
                  <img src={alumni.image} alt={alumni.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-medium text-foreground text-sm mb-1">{alumni.name}</h3>
                <p className="text-xs text-muted-foreground">{alumni.university}</p>
                <p className="text-xs text-primary">Batch {alumni.batch}</p>
              </div>
            ))}
          </div>

          {filteredAlumni.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No alumni found matching your criteria.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Alumni;
