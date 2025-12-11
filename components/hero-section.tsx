"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Cpu, Zap, Activity } from "lucide-react"

export function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Real-Time Operating Systems</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance text-foreground">
              Adaptive OS Scheduler for{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Real-Time Systems
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              A smart real-time scheduler that starts with Rate Monotonic (RM), continuously monitors deadline misses,
              and automatically switches to Earliest Deadline First (EDF) under overload conditions.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 group"
                onClick={() => scrollToSection("#simulation")}
              >
                Try Interactive Simulation
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-primary/5 hover:border-primary/30 bg-transparent"
                onClick={() => scrollToSection("#how-it-works")}
              >
                Learn How It Works
              </Button>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Student:</strong> Ansh
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Guide:</strong> Dr. Gurbinder Singh Brar
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Redesigned Abstract Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Main card */}
              <div className="absolute inset-8 rounded-3xl bg-gradient-to-br from-card to-muted border border-border shadow-2xl shadow-primary/10 p-8 flex flex-col justify-between">
                {/* CPU Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <Cpu className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">CPU Scheduler</p>
                      <p className="text-xs text-muted-foreground">Adaptive Mode</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-chart-1" />
                    <span className="w-3 h-3 rounded-full bg-chart-2" />
                    <span className="w-3 h-3 rounded-full bg-chart-3" />
                  </div>
                </div>

                {/* Task Bars Animation */}
                <div className="space-y-3 py-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8">T1</span>
                    <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-chart-1 rounded-full animate-pulse" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8">T2</span>
                    <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-chart-2 rounded-full animate-pulse"
                        style={{ width: "60%", animationDelay: "0.5s" }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8">T3</span>
                    <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-chart-3 rounded-full animate-pulse"
                        style={{ width: "45%", animationDelay: "1s" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Real-time monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">Active</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div
                className="absolute top-4 right-4 w-16 h-16 rounded-2xl bg-chart-1/20 border border-chart-1/30 flex items-center justify-center animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <span className="text-lg font-bold text-chart-1">RM</span>
              </div>
              <div
                className="absolute bottom-4 left-4 w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center animate-bounce"
                style={{ animationDuration: "3s", animationDelay: "1.5s" }}
              >
                <span className="text-lg font-bold text-accent">EDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
