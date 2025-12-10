import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Programs", path: "/programs" },
  { name: "Events", path: "/events" },
  { name: "Alumni", path: "/alumni" },
  { name: "Publications", path: "/publications" },
];

const moreLinks = [
  { name: "Collaborators", path: "/collaborators" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Team", path: "/team" },
  { name: "Join Us", path: "/join" },
  { name: "Contact", path: "/contact" },
];

export const Footer = () => {
  const { data: settings } = useSiteSettings();

  const siteName = settings?.site_name || "HEAL Pakistan";
  const slogan = settings?.slogan || "Reach the Unreached";
  const contactEmail = settings?.contact_email || "contact@healpakistan.org";
  const contactPhone = settings?.contact_phone || "+92 300 1234567";
  const contactAddress = settings?.contact_address || "Islamabad, Pakistan";
  const socials = {
    facebook: settings?.social_facebook || "#",
    twitter: settings?.social_twitter || "#",
    instagram: settings?.social_instagram || "#",
    linkedin: settings?.social_linkedin || "#",
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={siteName} className="w-12 h-12 object-contain rounded-full bg-primary/10" />
              ) : (
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">{siteName?.[0]?.toUpperCase() ?? "H"}</span>
                </div>
              )}
              <div>
                <h3 className="font-serif font-bold text-xl">{siteName}</h3>
                <p className="text-sm opacity-80">{slogan}</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Inspiring humanity and fostering healing through our initiative to reach the unreached. 
              Empowering youth with education and awareness.
            </p>
            <div className="flex gap-3">
              <a href={socials.facebook || "#"} className="w-10 h-10 bg-primary/20 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={socials.twitter || "#"} className="w-10 h-10 bg-primary/20 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={socials.instagram || "#"} className="w-10 h-10 bg-primary/20 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={socials.linkedin || "#"} className="w-10 h-10 bg-primary/20 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">More</h4>
            <ul className="space-y-2">
              {moreLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 opacity-80" />
                <span className="text-sm opacity-80">{contactEmail}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 opacity-80" />
                <span className="text-sm opacity-80">{contactPhone}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 opacity-80" />
                <span className="text-sm opacity-80">{contactAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-12 pt-8 text-center space-y-3">
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} HEAL Pakistan. All rights reserved.
          </p>
          <a
            href="https://portfolio-olive-eta-71.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/80">
              Powered by
            </span>
            <span>Vibe Coderz</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
