import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useQuery } from "@tanstack/react-query";
import { listHeroSlides } from "@/api/hero";

export const HeroSection = () => {
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const { data: slides, isLoading: slidesLoading } = useQuery({ queryKey: ["hero-slides"], queryFn: listHeroSlides });

  const isLoading = settingsLoading || slidesLoading;

  const heroTitle = settings?.hero_title || "HEAL Pakistan";
  const heroSubtitle = settings?.hero_subtitle || "Reach the Unreached";
  const heroText =
    settings?.hero_text ||
    "Inspiring humanity and fostering healing through our initiative to reach the unreached. Empowering youth with education and awareness, cultivating a compassionate generation dedicated to uplifting communities across Pakistan.";

  const mediaSlides = slides && slides.length > 0 ? slides : null;
  const [active, setActive] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Hero section should be visible immediately on mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const goToNextSlide = useCallback(() => {
    if (!mediaSlides || mediaSlides.length <= 1) return;
    setActive((prev) => (prev + 1) % mediaSlides.length);
  }, [mediaSlides]);

  useEffect(() => {
    if (!mediaSlides || mediaSlides.length <= 1) return;
    // Pause auto-rotation while a video is playing; advance when it ends instead.
    if (mediaSlides[active]?.media_type === "video") return;

    const timer = setInterval(goToNextSlide, 6500);
    return () => clearInterval(timer);
  }, [mediaSlides, active, goToNextSlide]);

  const currentMedia = useMemo(() => {
    if (!mediaSlides || mediaSlides.length === 0) return null;
    return mediaSlides[active] ?? mediaSlides[0];
  }, [mediaSlides, active]);

  const renderBackground = () => {
    if (!currentMedia) {
      return (
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/75 to-secondary/55" />
      );
    }

    if (currentMedia.media_type === "video") {
      return (
        <div className="absolute inset-0 overflow-hidden">
          <video
            src={currentMedia.media_url}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onEnded={goToNextSlide}
          />
        </div>
      );
    }

    return (
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${currentMedia.media_url})` }}
      />
    );
  };

  if (isLoading) {
    return (
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/75 to-secondary/55" />
        <div className="container mx-auto px-4 relative z-10 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {renderBackground()}

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`max-w-2xl transition-all duration-1000 relative ${
            isMounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Semi-transparent background behind text for readability */}
          <div className="absolute inset-0 -mx-6 -my-4 bg-black/30 backdrop-blur-[0.5px] rounded-lg -z-10" />
          
          <div className="relative p-6">
            <p className="text-primary font-medium mb-4">Welcome to</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {heroTitle}
            </h1>
            <p className="text-2xl md:text-3xl text-white/95 font-serif italic mb-6">
              {heroSubtitle}
            </p>
            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
              {heroText}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                <Link to="/about">
                  Learn More
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link to="/join">Join Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {mediaSlides && mediaSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {mediaSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`h-2 w-8 rounded-full transition ${idx === active ? "bg-primary" : "bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
