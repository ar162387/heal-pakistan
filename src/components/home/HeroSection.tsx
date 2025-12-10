import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useQuery } from "@tanstack/react-query";
import { listHeroSlides } from "@/api/hero";

export const HeroSection = () => {
  const { data: settings } = useSiteSettings();
  const { data: slides } = useQuery({ queryKey: ["hero-slides"], queryFn: listHeroSlides });

  const heroTitle = settings?.hero_title || "HEAL Pakistan";
  const heroSubtitle = settings?.hero_subtitle || "Reach the Unreached";
  const heroText =
    settings?.hero_text ||
    "Inspiring humanity and fostering healing through our initiative to reach the unreached. Empowering youth with education and awareness, cultivating a compassionate generation dedicated to uplifting communities across Pakistan.";

  const mediaSlides = slides && slides.length > 0 ? slides : null;
  const [active, setActive] = useState(0);

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
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
        </div>
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
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
        </div>
      );
    }

    return (
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${currentMedia.media_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
      </div>
    );
  };

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {renderBackground()}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <p className="text-primary font-medium mb-4 animate-fade-in">Welcome to</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-4">
            {heroTitle}
          </h1>
          <p className="text-2xl md:text-3xl text-secondary-foreground/90 font-serif italic mb-6">
            {heroSubtitle}
          </p>
          <p className="text-lg text-secondary-foreground/80 mb-8 leading-relaxed max-w-xl">
            {heroText}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/about">
                Learn More
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-secondary-foreground/10 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/20"
            >
              <Link to="/join">Join Us</Link>
            </Button>
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
