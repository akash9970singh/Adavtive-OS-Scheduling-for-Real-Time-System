import { Target, AlertTriangle, Cog, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Target,
    title: "Strict Deadlines",
    description: "Real-time systems have tasks with strict deadlines that must be met for correct system behavior.",
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    icon: AlertTriangle,
    title: "System Failure Risk",
    description:
      "If a task misses its deadline, the system may fail or behave incorrectly, leading to critical issues.",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    icon: Cog,
    title: "Fixed Policy Limitations",
    description:
      "Traditional schedulers like RM and EDF have fixed policies and cannot adapt to sudden workload changes.",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: CheckCircle2,
    title: "Adaptive Solution",
    description:
      "Our adaptive scheduler starts in RM mode, monitors deadline misses, and switches to EDF when overload is detected.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            About the Project
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Understanding the Challenge</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time scheduling presents unique challenges that require innovative solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${feature.bg} group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
          <h3 className="font-semibold text-lg mb-4 text-primary">What This Project Builds</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Models periodic real-time tasks with period, execution time, and deadlines",
              "Starts scheduling in Rate Monotonic (RM) mode for predictable behavior",
              "Continuously monitors deadline misses to detect overload conditions",
              "Automatically switches to Earliest Deadline First (EDF) when necessary",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
