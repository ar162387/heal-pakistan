import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { EventsSection } from "@/components/home/EventsSection";
import { ChaptersSection } from "@/components/home/ChaptersSection";
import { AlumniPreview } from "@/components/home/AlumniPreview";
import { JoinSection } from "@/components/home/JoinSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutPreview />
      <ProgramsSection />
      <EventsSection />
      <ChaptersSection />
      <AlumniPreview />
      <JoinSection />
    </Layout>
  );
};

export default Index;
