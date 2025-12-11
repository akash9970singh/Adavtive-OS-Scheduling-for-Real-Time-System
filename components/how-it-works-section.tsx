import { FileText, Play, Eye, RefreshCw, BarChart3 } from "lucide-react"

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Task Modelling",
    description:
      "Each real-time task is defined by its period and execution time. The system simulates three periodic tasks.",
    color: "bg-chart-1",
  },
  {
    icon: Play,
    number: "02",
    title: "Initial RM Scheduling",
    description:
      "The scheduler starts with Rate Monotonic. Shorter periods get higher fixed priority for predictable scheduling.",
    color: "bg-chart-2",
  },
  {
    icon: Eye,
    number: "03",
    title: "Monitor Deadlines",
    description:
      "During simulation, each task instance is checked. Deadline misses are counted over a sliding time window.",
    color: "bg-chart-4",
  },
  {
    icon: RefreshCw,
    number: "04",
    title: "Switch to EDF",
    description:
      "If deadline misses exceed a threshold, the scheduler switches to EDF for better high-load performance.",
    color: "bg-accent",
  },
  {
    icon: BarChart3,
    number: "05",
    title: "Collect Results",
    description: "The simulator records jobs completed and deadlines missed in each mode for comparative analysis.",
    color: "bg-primary",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How the Adaptive Scheduler Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">A step-by-step breakdown of the scheduling process</p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-chart-1 via-chart-4 to-primary rounded-full" />

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="flex flex-col items-center text-center">
                  {/* Step Number */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-card border-2 border-border group-hover:border-primary/50 transition-all duration-300 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-primary/10">
                      <step.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span
                      className={`absolute -top-3 -right-3 w-8 h-8 rounded-full ${step.color} text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg`}
                    >
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
