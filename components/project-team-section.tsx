import { Card, CardContent } from "@/components/ui/card"
import { FileCode, Users, GraduationCap, Building2 } from "lucide-react"

export function ProjectTeamSection() {
  return (
    <section id="team" className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Credits
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Project & Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Meet the people behind this research project</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Project Details */}
          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FileCode className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Project Details</h3>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Title", value: "Adaptive OS Scheduler for Real-Time Systems" },
                  { label: "Domain", value: "Real-Time Operating Systems" },
                  { label: "Technology", value: "Python, Simulation, Scheduling Algorithms" },
                  { label: "Interface", value: "Web-based interactive simulator" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground text-sm w-24 shrink-0">{item.label}</span>
                    <span className="text-foreground font-medium text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team */}
          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Team</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                    <GraduationCap className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Ansh</p>
                    <p className="text-sm text-muted-foreground">Student Researcher</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-chart-2 to-chart-2/70 flex items-center justify-center shrink-0">
                    <Users className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Dr. Gurbinder Singh Brar</p>
                    <p className="text-sm text-muted-foreground">Project Guide</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-chart-1 to-chart-1/70 flex items-center justify-center shrink-0">
                    <Building2 className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">[College Name]</p>
                    <p className="text-sm text-muted-foreground">Department of Computer Science / IT</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
