import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Events from "./pages/Events";
import Alumni from "./pages/Alumni";
import Publications from "./pages/Publications";
import Collaborators from "./pages/Collaborators";
import Testimonials from "./pages/Testimonials";
import Team from "./pages/Team";
import Join from "./pages/Join";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AlumniManagement from "./pages/admin/AlumniManagement";
import EventsManagement from "./pages/admin/EventsManagement";
import PublicationsManagement from "./pages/admin/PublicationsManagement";
import TeamManagement from "./pages/admin/TeamManagement";
import TestimonialsManagement from "./pages/admin/TestimonialsManagement";
import MembershipManagement from "./pages/admin/MembershipManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/collaborators" element={<Collaborators />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/team" element={<Team />} />
          <Route path="/join" element={<Join />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="alumni" element={<AlumniManagement />} />
            <Route path="events" element={<EventsManagement />} />
            <Route path="publications" element={<PublicationsManagement />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="testimonials" element={<TestimonialsManagement />} />
            <Route path="membership" element={<MembershipManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
