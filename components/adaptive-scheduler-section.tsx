import { ArrowDown, Shield, Zap, Activity } from "lucide-react"

export function AdaptiveSchedulerSection() {
  return (
    <section id="adaptive" className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Innovation
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">The Adaptive Strategy</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Combining the best of both worlds through intelligent mode switching
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {[
              {
                num: 1,
                title: "Starts in RM Mode",
                desc: "The scheduler begins with Rate Monotonic for its predictable, analyzable behavior.",
              },
              {
                num: 2,
                title: "Monitors Deadline Misses",
                desc: "Keeps a sliding window of recent deadline misses to track system health.",
              },
              {
                num: 3,
                title: "Detects Overload",
                desc: "If too many deadlines are missed in RM, it interprets this as an overload condition.",
              },
              {
                num: 4,
                title: "Switches to EDF",
                desc: "When overload is detected, switches from RM to EDF for urgent deadline handling.",
              },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-4 group">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-bold shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Flow Diagram */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm space-y-4">
              {/* RM Mode Box */}
              <div className="p-6 rounded-2xl bg-card border-2 border-chart-1/30 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-chart-1/20 flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-chart-1" />
                </div>
                <h4 className="font-semibold text-chart-1 text-lg">RM Mode</h4>
                <p className="text-sm text-muted-foreground mt-1">Fixed Priority Scheduling</p>
              </div>

              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <ArrowDown className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Monitoring Box */}
              <div className="p-6 rounded-2xl bg-card border-2 border-primary/30 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-primary text-lg">Monitoring Misses</h4>
                <p className="text-sm text-muted-foreground mt-1">Threshold: 3 misses / 20 time units</p>
              </div>

              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <ArrowDown className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* EDF Mode Box */}
              <div className="p-6 rounded-2xl bg-card border-2 border-accent/30 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold text-accent text-lg">EDF Mode</h4>
                <p className="text-sm text-muted-foreground mt-1">Dynamic Priority Scheduling</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-card border border-border flex items-start gap-4 shadow-lg">
          <div className="p-3 rounded-xl bg-primary/10 shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Key Benefit:</strong> By adapting the scheduling policy at runtime, the
            system becomes more robust to overload compared to using RM or EDF alone. This hybrid approach leverages
            RM&apos;s predictability under normal load and EDF&apos;s efficiency under high utilization.
          </p>
        </div>
      </div>
    </section>
  )
}
