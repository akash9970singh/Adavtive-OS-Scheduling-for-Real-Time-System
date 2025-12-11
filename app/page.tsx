import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { AlgorithmsSection } from "@/components/algorithms-section"
import { AdaptiveSchedulerSection } from "@/components/adaptive-scheduler-section"
import { SimulationSection } from "@/components/simulation-section"
import { ProjectTeamSection } from "@/components/project-team-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <AlgorithmsSection />
      <AdaptiveSchedulerSection />
      <SimulationSection />
      <ProjectTeamSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
