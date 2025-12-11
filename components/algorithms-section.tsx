import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Unlock, CheckCircle, XCircle } from "lucide-react"

export function AlgorithmsSection() {
  return (
    <section id="algorithms" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Core Algorithms
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Scheduling Algorithms Used</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding the two fundamental scheduling approaches
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Rate Monotonic Card */}
          <Card className="bg-card border-border hover:shadow-xl hover:shadow-chart-1/10 transition-all duration-300 overflow-hidden group">
            <div className="h-2 bg-gradient-to-r from-chart-1 to-chart-1/50" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-chart-1/10 group-hover:bg-chart-1/20 transition-colors">
                    <Lock className="w-6 h-6 text-chart-1" />
                  </div>
                  <CardTitle className="text-xl text-foreground">Rate Monotonic (RM)</CardTitle>
                </div>
                <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20 hover:bg-chart-1/20">
                  Static Priority
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                A fixed-priority scheduling algorithm where priority is assigned based on task period.
              </p>

              <div className="space-y-3">
                {[
                  { positive: true, text: "Priority assigned by period (shorter period = higher priority)" },
                  { positive: true, text: "Works well for periodic tasks under certain CPU utilization limits" },
                  { positive: true, text: "Predictable and easy to analyze for schedulability" },
                  { positive: false, text: "Does not adapt automatically if workload changes" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {item.positive ? (
                      <CheckCircle className="w-5 h-5 text-chart-3 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                    )}
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* EDF Card */}
          <Card className="bg-card border-border hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden group">
            <div className="h-2 bg-gradient-to-r from-primary to-accent" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Unlock className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">Earliest Deadline First (EDF)</CardTitle>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  Dynamic Priority
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                A dynamic-priority algorithm where the job with earliest absolute deadline runs first.
              </p>

              <div className="space-y-3">
                {[
                  "At any instant, runs the job with the earliest absolute deadline",
                  "Provably optimal on a single processor for feasible schedules",
                  "Handles higher utilization better than RM in many cases",
                  "More flexible priority assignment at runtime",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-chart-3 mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
