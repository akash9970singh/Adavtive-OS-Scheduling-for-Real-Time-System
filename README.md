Adaptive OS Scheduler for Real-Time Systems
A hybrid CPU scheduler that starts predictable and gets aggressive under pressure — switching from Rate Monotonic to Earliest Deadline First the moment deadlines start slipping.

Next.js TypeScript Show Image

<p align="center"> <!-- Add a screenshot or short GIF of the live simulation here: 1. Run the site locally or open the deployed link 2. Screenshot the "Simulation" section with a run in progress 3. Upload it to the repo (e.g. docs/screenshot.png) and uncomment below --> <!-- <img src="docs/screenshot.png" alt="Adaptive scheduler simulation" width="800"> --> </p>
The problem
Real-time schedulers face a tradeoff:

Rate Monotonic (RM) — fixed priority by task period. Predictable, easy to analyze, well-understood — but rigid. It can't adapt when the workload shifts.
Earliest Deadline First (EDF) — dynamic priority by nearest deadline. Provably optimal on a single processor and handles higher utilization — but harder to reason about statically.
Most systems have to commit to one. This project doesn't.

The approach
An adaptive scheduler that runs both, switching automatically:

Starts in RM mode for predictable, analyzable behavior under normal load
Monitors a sliding window of recent deadline misses to track system health
Detects overload: if 3 deadlines are missed within 20 time units, it flags an overload condition
Switches to EDF to handle the urgent deadlines more aggressively, then can fall back once the system stabilizes
The result: RM's predictability when things are normal, EDF's efficiency when they're not — without committing to either one permanently.

Try it
An interactive web simulator lets you configure tasks and watch RM, EDF, and the adaptive scheduler run side by side in real time.

pnpm install
pnpm dev
Open http://localhost:3000.

No live deployment linked yet — the fastest way to get one: push this repo to Vercel (it auto-detects Next.js, zero config needed) and drop the URL in this README.

What's on the site
Overview — the problem and the adaptive approach, plainly explained
How it works — the RM → EDF switching mechanism, step by step
Algorithms — RM and EDF explained individually: classification, behavior, tradeoffs
Interactive simulation — configure tasks, run the scheduler, watch it adapt
Project & team — credits and context
Tech stack
Next.js (App Router) + TypeScript
Tailwind CSS + shadcn/ui components
Client-side scheduling simulation — no backend required to run the demo
Project structure
app/                    # Next.js App Router entry (layout, home page, global styles)
components/
  hero-section.tsx
  about-section.tsx
  how-it-works-section.tsx
  algorithms-section.tsx
  adaptive-scheduler-section.tsx
  simulation-section.tsx   # the interactive RM/EDF/adaptive simulator
  project-team-section.tsx
  contact-section.tsx
  ui/                     # shadcn/ui primitives
hooks/                  # shared React hooks
lib/                    # utilities
public/                 # static assets
Academic context
Built as a real-time operating systems project exploring hybrid scheduling strategies.

Guide: Dr. Gurbinder Singh Brar
(Fill in your institution/department and full team list here — the live site currently has this incomplete too.)

License
No license file yet — add one (MIT is a common default for academic/portfolio projects) if you want others to be able to reuse this freely.
