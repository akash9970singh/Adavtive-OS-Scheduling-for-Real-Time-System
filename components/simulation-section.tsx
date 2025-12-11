"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Pause, RotateCcw, Zap, Info } from "lucide-react"

interface Task {
  period: number
  executionTime: number
}

interface SimulationResult {
  timeline: number[]
  completedJobs: number
  missedDeadlines: number
  switchPoint?: number
}

interface TaskState {
  id: number
  period: number
  execTime: number
  remaining: number
  nextRelease: number
  deadline: number | null
  deadlineMissed: boolean
  completedJobs: number
  missedDeadlines: number
}

function cloneTasks(tasks: Task[]): TaskState[] {
  return tasks.map((t, i) => ({
    id: i + 1,
    period: t.period,
    execTime: t.executionTime,
    remaining: 0,
    nextRelease: 0,
    deadline: null,
    deadlineMissed: false,
    completedJobs: 0,
    missedDeadlines: 0,
  }))
}

function simulateRM(tasks: Task[], simTime: number): SimulationResult {
  const timeline: number[] = new Array(simTime).fill(0)
  const taskStates = cloneTasks(tasks)

  for (let t = 0; t < simTime; t++) {
    // 4.1 Release new jobs at time t
    for (const task of taskStates) {
      if (t === task.nextRelease) {
        // If previous job is unfinished, it has missed its deadline
        if (task.remaining > 0) {
          task.missedDeadlines++
        }
        // Start a new job
        task.remaining = task.execTime
        task.deadline = t + task.period
        task.deadlineMissed = false
        task.nextRelease = task.nextRelease + task.period
      }
    }

    // 4.2 Select which job will run at time t (RM: shortest period = highest priority)
    const readyTasks = taskStates.filter((task) => task.remaining > 0)
    let runningTask: TaskState | null = null

    if (readyTasks.length > 0) {
      // Sort by period (shortest first), then by id for tie-breaking
      readyTasks.sort((a, b) => {
        if (a.period !== b.period) return a.period - b.period
        return a.id - b.id
      })
      runningTask = readyTasks[0]
      timeline[t] = runningTask.id

      // 4.3 Execute for one time unit
      runningTask.remaining--

      // 4.4 Count completed jobs
      if (runningTask.remaining === 0) {
        runningTask.completedJobs++
      }
    }

    // 4.5 Check for deadline misses at end of step
    for (const task of taskStates) {
      if (task.remaining > 0 && task.deadline !== null && !task.deadlineMissed) {
        if (t + 1 > task.deadline) {
          task.missedDeadlines++
          task.deadlineMissed = true
        }
      }
    }
  }

  return {
    timeline,
    completedJobs: taskStates.reduce((sum, t) => sum + t.completedJobs, 0),
    missedDeadlines: taskStates.reduce((sum, t) => sum + t.missedDeadlines, 0),
  }
}

function simulateEDF(tasks: Task[], simTime: number): SimulationResult {
  const timeline: number[] = new Array(simTime).fill(0)
  const taskStates = cloneTasks(tasks)

  for (let t = 0; t < simTime; t++) {
    // 4.1 Release new jobs at time t
    for (const task of taskStates) {
      if (t === task.nextRelease) {
        // If previous job is unfinished, it has missed its deadline
        if (task.remaining > 0) {
          task.missedDeadlines++
        }
        // Start a new job
        task.remaining = task.execTime
        task.deadline = t + task.period
        task.deadlineMissed = false
        task.nextRelease = task.nextRelease + task.period
      }
    }

    // 4.2 Select which job will run (EDF: earliest absolute deadline first)
    const readyTasks = taskStates.filter((task) => task.remaining > 0)
    let runningTask: TaskState | null = null

    if (readyTasks.length > 0) {
      // Sort by deadline (earliest first), then by id for tie-breaking
      readyTasks.sort((a, b) => {
        const deadlineA = a.deadline ?? Number.POSITIVE_INFINITY
        const deadlineB = b.deadline ?? Number.POSITIVE_INFINITY
        if (deadlineA !== deadlineB) return deadlineA - deadlineB
        return a.id - b.id
      })
      runningTask = readyTasks[0]
      timeline[t] = runningTask.id

      // 4.3 Execute for one time unit
      runningTask.remaining--

      // 4.4 Count completed jobs
      if (runningTask.remaining === 0) {
        runningTask.completedJobs++
      }
    }

    // 4.5 Check for deadline misses at end of step
    for (const task of taskStates) {
      if (task.remaining > 0 && task.deadline !== null && !task.deadlineMissed) {
        if (t + 1 > task.deadline) {
          task.missedDeadlines++
          task.deadlineMissed = true
        }
      }
    }
  }

  return {
    timeline,
    completedJobs: taskStates.reduce((sum, t) => sum + t.completedJobs, 0),
    missedDeadlines: taskStates.reduce((sum, t) => sum + t.missedDeadlines, 0),
  }
}

function simulateAdaptive(tasks: Task[], simTime: number): SimulationResult {
  const timeline: number[] = new Array(simTime).fill(0)
  const taskStates = cloneTasks(tasks)

  let currentMode: "RM" | "EDF" = "RM"
  let switchTime: number | undefined
  const missHistory: number[] = []
  const windowSize = 20
  const missThreshold = 3

  for (let t = 0; t < simTime; t++) {
    let missesThisStep = 0

    // 4.1 Release new jobs at time t
    for (const task of taskStates) {
      if (t === task.nextRelease) {
        // If previous job is unfinished, it has missed its deadline
        if (task.remaining > 0) {
          task.missedDeadlines++
          missesThisStep++
        }
        // Start a new job
        task.remaining = task.execTime
        task.deadline = t + task.period
        task.deadlineMissed = false
        task.nextRelease = task.nextRelease + task.period
      }
    }

    // 4.2 Select which job will run based on current mode
    const readyTasks = taskStates.filter((task) => task.remaining > 0)
    let runningTask: TaskState | null = null

    if (readyTasks.length > 0) {
      if (currentMode === "RM") {
        // RM: shortest period = highest priority
        readyTasks.sort((a, b) => {
          if (a.period !== b.period) return a.period - b.period
          return a.id - b.id
        })
      } else {
        // EDF: earliest deadline first
        readyTasks.sort((a, b) => {
          const deadlineA = a.deadline ?? Number.POSITIVE_INFINITY
          const deadlineB = b.deadline ?? Number.POSITIVE_INFINITY
          if (deadlineA !== deadlineB) return deadlineA - deadlineB
          return a.id - b.id
        })
      }
      runningTask = readyTasks[0]
      timeline[t] = runningTask.id

      // 4.3 Execute for one time unit
      runningTask.remaining--

      // 4.4 Count completed jobs
      if (runningTask.remaining === 0) {
        runningTask.completedJobs++
      }
    }

    // 4.5 Check for deadline misses at end of step
    for (const task of taskStates) {
      if (task.remaining > 0 && task.deadline !== null && !task.deadlineMissed) {
        if (t + 1 > task.deadline) {
          task.missedDeadlines++
          missesThisStep++
          task.deadlineMissed = true
        }
      }
    }

    // 7.4 Track misses in sliding window
    missHistory.push(missesThisStep)
    if (missHistory.length > windowSize) {
      missHistory.shift()
    }

    // 7.5 Check switching condition
    const recentMisses = missHistory.reduce((sum, m) => sum + m, 0)
    if (currentMode === "RM" && recentMisses >= missThreshold) {
      currentMode = "EDF"
      if (switchTime === undefined) {
        switchTime = t
      }
    }
  }

  return {
    timeline,
    completedJobs: taskStates.reduce((sum, t) => sum + t.completedJobs, 0),
    missedDeadlines: taskStates.reduce((sum, t) => sum + t.missedDeadlines, 0),
    switchPoint: switchTime,
  }
}

const TASK_COLORS = [
  { bg: "rgb(234, 88, 12)", name: "Task 1" }, // orange
  { bg: "rgb(124, 58, 237)", name: "Task 2" }, // violet
  { bg: "rgb(16, 185, 129)", name: "Task 3" }, // emerald
]

const IDLE_COLOR = "rgb(229, 231, 235)"

export function SimulationSection() {
  const [tasks, setTasks] = useState<Task[]>([
    { period: 8, executionTime: 3 },
    { period: 12, executionTime: 4 },
    { period: 16, executionTime: 5 },
  ])
  const [simTime, setSimTime] = useState(100)
  const [results, setResults] = useState<{
    rm: SimulationResult | null
    edf: SimulationResult | null
    adaptive: SimulationResult | null
  }>({ rm: null, edf: null, adaptive: null })
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  const canvasRefs = {
    rm: useRef<HTMLCanvasElement>(null),
    edf: useRef<HTMLCanvasElement>(null),
    adaptive: useRef<HTMLCanvasElement>(null),
  }

  const runSimulation = () => {
    const rm = simulateRM(tasks, simTime)
    const edf = simulateEDF(tasks, simTime)
    const adaptive = simulateAdaptive(tasks, simTime)
    setResults({ rm, edf, adaptive })
    setAnimationProgress(0)
    setIsPlaying(true)
    lastTimeRef.current = 0
  }

  const resetSimulation = () => {
    setResults({ rm: null, edf: null, adaptive: null })
    setAnimationProgress(0)
    setIsPlaying(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const drawTimeline = useCallback(
    (canvas: HTMLCanvasElement | null, timeline: number[], progress: number, switchPoint?: number) => {
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const width = canvas.width
      const height = canvas.height
      const visibleUnits = Math.floor(progress * timeline.length)
      const unitWidth = width / timeline.length

      ctx.clearRect(0, 0, width, height)

      // Draw background
      ctx.fillStyle = IDLE_COLOR
      ctx.fillRect(0, 0, width, height)

      // Draw timeline segments
      for (let i = 0; i < visibleUnits; i++) {
        const taskId = timeline[i]
        if (taskId > 0) {
          ctx.fillStyle = TASK_COLORS[taskId - 1].bg
          ctx.fillRect(i * unitWidth, 0, unitWidth + 0.5, height - 20)
        }
      }

      // Draw switch point marker for adaptive
      if (switchPoint !== undefined && switchPoint < visibleUnits) {
        ctx.strokeStyle = "#ef4444"
        ctx.lineWidth = 3
        ctx.setLineDash([5, 3])
        ctx.beginPath()
        ctx.moveTo(switchPoint * unitWidth, 0)
        ctx.lineTo(switchPoint * unitWidth, height - 20)
        ctx.stroke()
        ctx.setLineDash([])

        // Draw label
        ctx.fillStyle = "#ef4444"
        ctx.font = "bold 10px sans-serif"
        ctx.fillText("Switch→EDF", switchPoint * unitWidth + 4, 12)
      }

      // Draw time markers
      ctx.fillStyle = "#6b7280"
      ctx.font = "10px sans-serif"
      const markerInterval = Math.max(1, Math.floor(timeline.length / 10))
      for (let i = 0; i <= timeline.length; i += markerInterval) {
        const x = i * unitWidth
        ctx.fillText(i.toString(), x + 2, height - 4)
      }
    },
    [],
  )

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !results.rm) return

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const delta = timestamp - lastTimeRef.current

      if (delta > 50 / speed) {
        lastTimeRef.current = timestamp
        setAnimationProgress((prev) => {
          const next = prev + 0.01 * speed
          if (next >= 1) {
            setIsPlaying(false)
            return 1
          }
          return next
        })
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, results.rm, speed])

  // Draw canvases when progress updates
  useEffect(() => {
    if (results.rm) drawTimeline(canvasRefs.rm.current, results.rm.timeline, animationProgress)
    if (results.edf) drawTimeline(canvasRefs.edf.current, results.edf.timeline, animationProgress)
    if (results.adaptive)
      drawTimeline(
        canvasRefs.adaptive.current,
        results.adaptive.timeline,
        animationProgress,
        results.adaptive.switchPoint,
      )
  }, [animationProgress, results, drawTimeline])

  const updateTask = (index: number, field: keyof Task, value: number) => {
    const newTasks = [...tasks]
    newTasks[index] = { ...newTasks[index], [field]: Math.max(1, value) }
    setTasks(newTasks)
  }

  return (
    <section id="simulation" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Interactive Tool
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Simulation & Results</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Configure tasks and watch the scheduling algorithms in action with real RM, EDF, and Adaptive logic
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Zap className="w-5 h-5 text-primary" />
                Task Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {tasks.map((task, i) => (
                <div key={i} className="space-y-3 p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: TASK_COLORS[i].bg }} />
                    <span className="font-medium text-foreground">Task {i + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Period (P)</Label>
                      <Input
                        type="number"
                        value={task.period}
                        onChange={(e) => updateTask(i, "period", Number.parseInt(e.target.value) || 1)}
                        className="h-9 bg-card"
                        min={1}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Exec Time (C)</Label>
                      <Input
                        type="number"
                        value={task.executionTime}
                        onChange={(e) => updateTask(i, "executionTime", Number.parseInt(e.target.value) || 1)}
                        className="h-9 bg-card mt-1"
                        min={1}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl bg-muted/50">
                <Label className="text-xs text-muted-foreground">Simulation Time</Label>
                <Input
                  type="number"
                  value={simTime}
                  onChange={(e) => setSimTime(Math.max(10, Number.parseInt(e.target.value) || 100))}
                  className="h-9 bg-card mt-1"
                  min={10}
                />
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-primary">Tip:</strong> To see overload and Adaptive switching, use tight
                    periods with long execution times (e.g., P=8,12,16 with C=3,4,5). Total utilization above 100% will
                    cause deadline misses.
                  </p>
                </div>
              </div>

              <Button
                onClick={runSimulation}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Run RM, EDF & Adaptive
              </Button>
            </CardContent>
          </Card>

          {/* Timeline Graphs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            {results.rm && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border shadow-lg flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={animationProgress >= 1}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetSimulation}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Speed:</span>
                  {[0.5, 1, 2].map((s) => (
                    <Button
                      key={s}
                      variant={speed === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSpeed(s)}
                      className="w-12"
                    >
                      {s}x
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  {TASK_COLORS.map((color, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: color.bg }} />
                      <span className="text-muted-foreground">T{i + 1}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-gray-200" />
                    <span className="text-muted-foreground">Idle</span>
                  </div>
                </div>
              </div>
            )}

            {/* RM Timeline */}
            <Card className="bg-card border-border shadow-lg overflow-hidden">
              <CardHeader className="pb-2 bg-orange-500/5 border-b border-orange-500/20">
                <CardTitle className="text-sm font-medium text-orange-600 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  RM Only — CPU Schedule (Static Priority: Shorter Period = Higher Priority)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <canvas ref={canvasRefs.rm} width={800} height={80} className="w-full h-20 rounded-lg" />
                {!results.rm && (
                  <div className="flex items-center justify-center text-muted-foreground text-sm h-20">
                    Run simulation to see results
                  </div>
                )}
              </CardContent>
            </Card>

            {/* EDF Timeline */}
            <Card className="bg-card border-border shadow-lg overflow-hidden">
              <CardHeader className="pb-2 bg-violet-500/5 border-b border-violet-500/20">
                <CardTitle className="text-sm font-medium text-violet-600 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                  EDF Only — CPU Schedule (Dynamic Priority: Earliest Deadline First)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <canvas ref={canvasRefs.edf} width={800} height={80} className="w-full h-20 rounded-lg" />
                {!results.edf && (
                  <div className="flex items-center justify-center text-muted-foreground text-sm h-20">
                    Run simulation to see results
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Adaptive Timeline */}
            <Card className="bg-card border-border shadow-lg overflow-hidden">
              <CardHeader className="pb-2 bg-primary/5 border-b border-primary/20">
                <CardTitle className="text-sm font-medium text-primary flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    Adaptive (RM → EDF) — Switches on Overload Detection
                  </span>
                  {results.adaptive?.switchPoint !== undefined && (
                    <span className="text-xs text-destructive font-semibold bg-destructive/10 px-2 py-1 rounded">
                      Switched at t={results.adaptive.switchPoint}
                    </span>
                  )}
                  {results.adaptive && results.adaptive.switchPoint === undefined && (
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-1 rounded">
                      No switch needed
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <canvas ref={canvasRefs.adaptive} width={800} height={80} className="w-full h-20 rounded-lg" />
                {!results.adaptive && (
                  <div className="flex items-center justify-center text-muted-foreground text-sm h-20">
                    Run simulation to see results
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparison Table */}
        {results.rm && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Comparison Summary</h3>
            <Card className="bg-card border-border shadow-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent bg-muted/50">
                    <TableHead className="text-foreground font-semibold">Method</TableHead>
                    <TableHead className="text-foreground text-center font-semibold">Total Jobs Completed</TableHead>
                    <TableHead className="text-foreground text-center font-semibold">Deadlines Missed</TableHead>
                    <TableHead className="text-foreground text-center font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border">
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-orange-500" />
                        RM Only
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{results.rm.completedJobs}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={
                          results.rm.missedDeadlines > 0 ? "text-destructive font-semibold" : "text-emerald-600"
                        }
                      >
                        {results.rm.missedDeadlines}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {results.rm.missedDeadlines === 0 ? (
                        <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded">
                          Schedulable
                        </span>
                      ) : (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">Overloaded</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border">
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-violet-500" />
                        EDF Only
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{results.edf?.completedJobs}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={
                          results.edf && results.edf.missedDeadlines > 0
                            ? "text-destructive font-semibold"
                            : "text-emerald-600"
                        }
                      >
                        {results.edf?.missedDeadlines}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {results.edf?.missedDeadlines === 0 ? (
                        <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded">
                          Schedulable
                        </span>
                      ) : (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">Overloaded</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border">
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary" />
                        Adaptive (RM → EDF)
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {results.adaptive?.completedJobs}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={
                          results.adaptive && results.adaptive.missedDeadlines > 0
                            ? "text-amber-600 font-semibold"
                            : "text-emerald-600"
                        }
                      >
                        {results.adaptive?.missedDeadlines}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {results.adaptive?.switchPoint !== undefined ? (
                        <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded">
                          Switched at t={results.adaptive.switchPoint}
                        </span>
                      ) : (
                        <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded">RM only</span>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                <strong className="text-orange-600">RM (Rate Monotonic):</strong>
                <span className="text-muted-foreground text-sm ml-2">
                  Static priorities based on period. May miss more deadlines under overload since it cannot adapt.
                </span>
              </div>
              <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                <strong className="text-violet-600">EDF (Earliest Deadline First):</strong>
                <span className="text-muted-foreground text-sm ml-2">
                  Dynamic priorities based on deadline. Optimal for single-processor systems up to 100% utilization.
                </span>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <strong className="text-primary">Adaptive:</strong>
                <span className="text-muted-foreground text-sm ml-2">
                  Starts with RM for predictability, switches to EDF when overload is detected (3+ misses in 20 time
                  units).
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
