import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Heart, Users, GraduationCap, Loader2 } from "lucide-react";
import { fetchPublicTeamMembers } from "@/api/team";
import { PublicTeamMember, TeamRole } from "@/types/team";
import { useMemo } from "react";

const getRoleDisplayName = (role: TeamRole) => {
  switch (role) {
    case "founder":
      return "Founder";
    case "co-founder":
      return "Co-Founder";
    case "cabinet_member":
      return "Cabinet Member";
    case "chapter_lead":
      return "Chapter Lead";
    case "collaborator":
      return "Collaborator";
    default:
      return role;
  }
};

const Team = () => {
  const { data: teamMembers = [], isLoading, isError } = useQuery({
    queryKey: ["public-team-members"],
    queryFn: fetchPublicTeamMembers,
  });

  const leadershipMembers = useMemo(() => {
    return teamMembers.filter((m) => m.role === "founder" || m.role === "co-founder");
  }, [teamMembers]);

  const cabinetMembers = useMemo(() => {
    return teamMembers.filter((m) => m.role === "cabinet_member");
  }, [teamMembers]);

  const chapterLeads = useMemo(() => {
    return teamMembers.filter((m) => m.role === "chapter_lead");
  }, [teamMembers]);

  if (isError) {
    return (
      <Layout>
        <section className="bg-primary py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Our Team
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Meet the dedicated individuals leading HEAL Pakistan's mission to reach the unreached.
            </p>
          </div>
        </section>
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Failed to load team members. Please try again later.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Our Team
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Meet the dedicated individuals leading HEAL Pakistan's mission to reach the unreached.
          </p>
        </div>
      </section>

      {/* Leadership */}
      {isLoading ? (
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        </section>
      ) : (
        <>
          {leadershipMembers.length > 0 && (
            <section className="py-16 lg:py-24 bg-background">
              <div className="container mx-auto px-4">
                <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">Leadership</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  {leadershipMembers.map((member) => (
                    <div key={member.id} className="bg-card p-8 rounded-lg shadow-md text-center">
                      <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden bg-primary/20 flex items-center justify-center">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Heart className="h-12 w-12 text-primary" />
                        )}
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{member.name}</h3>
                      <p className="text-primary font-medium mb-2">
                        {member.designation || getRoleDisplayName(member.role)}
                      </p>
                      {member.description && (
                        <p className="text-sm text-muted-foreground mt-3">{member.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Cabinet */}
          {cabinetMembers.length > 0 && (
            <section className="py-16 lg:py-24 bg-accent">
              <div className="container mx-auto px-4">
                <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-4">Cabinet Members</h2>
                <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
                  Our cabinet members bring diverse expertise and passion to drive HEAL Pakistan's initiatives forward.
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                  {cabinetMembers.map((member) => (
                    <div key={member.id} className="bg-card p-6 rounded-lg shadow-md text-center">
                      <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-primary/10 flex items-center justify-center">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {member.designation || getRoleDisplayName(member.role)}
                      </p>
                      {member.description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{member.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Chapter Leads */}
          {chapterLeads.length > 0 && (
            <section className="py-16 lg:py-24 bg-background">
              <div className="container mx-auto px-4">
                <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-4">Chapter Leads</h2>
                <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
                  Our chapter leads represent HEAL Pakistan across different universities, driving local impact and engagement.
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {chapterLeads.map((member) => (
                    <div key={member.id} className="bg-card p-6 rounded-lg shadow-md text-center">
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-primary/10 flex items-center justify-center">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <GraduationCap className="h-10 w-10 text-primary" />
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {member.designation || getRoleDisplayName(member.role)}
                      </p>
                      {member.university && (
                        <p className="text-xs text-primary font-medium mb-2">{member.university}</p>
                      )}
                      {member.description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{member.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Empty State */}
          {!isLoading &&
            leadershipMembers.length === 0 &&
            cabinetMembers.length === 0 &&
            chapterLeads.length === 0 && (
              <section className="py-16 lg:py-24 bg-background">
                <div className="container mx-auto px-4 text-center">
                  <p className="text-muted-foreground">Team information will be available soon.</p>
                </div>
              </section>
            )}
        </>
      )}
    </Layout>
  );
};

export default Team;
