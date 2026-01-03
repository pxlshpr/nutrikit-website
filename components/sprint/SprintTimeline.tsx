'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SprintConfig, SprintInfo, SprintTask, getSprintName, getStatusColor, getPriorityColor } from '@/lib/sprint-parser';

// Sprint number offset (0 = use actual number from file, which is the source of truth)
const SPRINT_OFFSET = 0;

// Tasks per sprint for planning
const TASKS_PER_SPRINT = 4;

interface SprintTimelineProps {
  currentSprint: SprintInfo;
  config: SprintConfig;
  currentTasks: SprintTask[];
  allTasks?: SprintTask[]; // All tasks including backlog for future planning
}

interface TimelineNode {
  sprint: number;
  displayNumber: number;
  name: string;
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
  tasks: SprintTask[];
}

// Display names for statuses
function getStatusDisplayName(status: SprintTask['status']): string {
  if (status === 'Prompt Ready') return 'Claude Ready';
  return status;
}

// Distribute remaining tasks into future sprints
function distributeTasks(
  currentSprintNum: number,
  currentTasks: SprintTask[],
  allTasks: SprintTask[]
): Map<number, SprintTask[]> {
  const sprintTaskMap = new Map<number, SprintTask[]>();

  // Current sprint gets its actual tasks
  sprintTaskMap.set(currentSprintNum, currentTasks);

  // Get remaining tasks (not Done, not in current sprint)
  const currentTaskIds = new Set(currentTasks.map(t => t.id));
  const remainingTasks = allTasks
    .filter(t => t.status !== 'Done' && t.status !== 'Canceled' && !currentTaskIds.has(t.id))
    .sort((a, b) => {
      // Sort by priority
      const priorityOrder: Record<string, number> = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3, 'None': 4 };
      return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    });

  // Distribute into future sprints
  let sprintNum = currentSprintNum + 1;
  let taskIndex = 0;

  while (taskIndex < remainingTasks.length) {
    const sprintTasks: SprintTask[] = [];
    for (let i = 0; i < TASKS_PER_SPRINT && taskIndex < remainingTasks.length; i++) {
      sprintTasks.push(remainingTasks[taskIndex]);
      taskIndex++;
    }
    sprintTaskMap.set(sprintNum, sprintTasks);
    sprintNum++;
  }

  return sprintTaskMap;
}

export default function SprintTimeline({ currentSprint, currentTasks, allTasks = [] }: SprintTimelineProps) {
  const [selectedSprint, setSelectedSprint] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const currentSprintNum = currentSprint.number;

  // Distribute tasks across sprints
  const sprintTaskMap = distributeTasks(currentSprintNum, currentTasks, allTasks);

  // Generate timeline nodes: start from sprint 1, show all past + current + future
  const maxFutureSprint = Math.max(
    currentSprintNum + 4,
    ...Array.from(sprintTaskMap.keys())
  );

  const nodes: TimelineNode[] = [];

  // Start from sprint 1 to include all history
  for (let i = 1; i <= maxFutureSprint; i++) {
    const displayNumber = i + SPRINT_OFFSET;
    nodes.push({
      sprint: i,
      displayNumber,
      name: getSprintName(displayNumber),
      isCurrent: i === currentSprintNum,
      isPast: i < currentSprintNum,
      isFuture: i > currentSprintNum,
      tasks: sprintTaskMap.get(i) || [],
    });
  }

  const selectedNode = nodes.find(n => n.sprint === selectedSprint);

  // Check scroll state
  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    updateScrollState();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollState);
      window.addEventListener('resize', updateScrollState);

      // Scroll to current sprint on mount
      const currentIndex = nodes.findIndex(n => n.isCurrent);
      if (currentIndex > 0) {
        const nodeWidth = 80; // Approximate width of each node
        const scrollPosition = Math.max(0, (currentIndex - 1) * nodeWidth);
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }

      return () => {
        container.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, [nodes.length]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Sprint Timeline</h2>
          <p className="text-muted text-sm">Tap a sprint to see its tasks</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? 'glass-strong hover:bg-white/10 cursor-pointer opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? 'glass-strong hover:bg-white/10 cursor-pointer opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Horizontal line */}
          <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-1/2" />

          {/* Fade edges for scroll indication */}
          <div className={`absolute left-10 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute right-10 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

          {/* Timeline nodes - scrollable */}
          <div
            ref={scrollContainerRef}
            className="relative flex items-center py-8 overflow-x-auto gap-4 px-14 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {nodes.map((node) => (
              <button
                key={node.sprint}
                onClick={() => setSelectedSprint(selectedSprint === node.sprint ? null : node.sprint)}
                className={`flex-shrink-0 flex flex-col items-center transition-all duration-300 ${
                  node.isCurrent ? 'scale-110 z-10' : ''
                } ${selectedSprint === node.sprint ? 'scale-110' : ''}`}
              >
                {/* Node circle with distinct states */}
                <div
                  className={`
                    relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center
                    transition-all duration-300 font-mono text-sm font-bold cursor-pointer
                    ${selectedSprint === node.sprint
                      ? 'ring-2 ring-accent ring-offset-2 ring-offset-background'
                      : ''
                    }
                    ${node.isCurrent
                      ? 'bg-accent/30 border-2 border-accent shadow-[0_0_20px_rgba(160,99,255,0.5)] scale-110'
                      : node.isPast
                        ? 'bg-success/20 border-2 border-success/50'
                        : 'bg-transparent border-2 border-dashed border-white/30 hover:border-white/50'
                    }
                  `}
                >
                  {/* Completed checkmark for past sprints */}
                  {node.isPast && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {/* Sprint number */}
                  <span className={
                    node.isCurrent
                      ? 'text-accent font-bold'
                      : node.isPast
                        ? 'text-success'
                        : 'text-muted-foreground'
                  }>
                    {node.displayNumber}
                  </span>

                  {/* Task count badge for future sprints */}
                  {node.isFuture && node.tasks.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white/20 text-foreground text-xs font-bold flex items-center justify-center border border-white/30">
                      {node.tasks.length}
                    </div>
                  )}

                  {/* Current sprint task count */}
                  {node.isCurrent && node.tasks.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-background text-xs font-bold flex items-center justify-center">
                      {node.tasks.length}
                    </div>
                  )}

                  {/* Current indicator pulse */}
                  {node.isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
                  )}
                </div>

                {/* Sprint info */}
                <div className={`mt-3 text-center ${node.isCurrent || selectedSprint === node.sprint ? '' : 'hidden sm:block'}`}>
                  <div className={`text-xs font-mono ${
                    node.isCurrent
                      ? 'text-accent'
                      : node.isPast
                        ? 'text-success/80'
                        : selectedSprint === node.sprint
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                  }`}>
                    {node.name}
                  </div>
                  {node.isCurrent && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-accent/20 text-accent text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      NOW
                    </div>
                  )}
                  {node.isPast && (
                    <div className="text-xs text-success/60 mt-1">
                      done
                    </div>
                  )}
                  {node.isFuture && node.tasks.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      planned
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sprint Tasks */}
        {selectedNode && (
          <div className="mt-8 glass rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">
                  Sprint {selectedNode.displayNumber}: {selectedNode.name}
                </h3>
                <p className="text-sm text-muted">
                  {selectedNode.isCurrent ? 'Current sprint' : selectedNode.isPast ? 'Completed sprint' : 'Planned tasks (tentative)'}
                </p>
              </div>
              <button
                onClick={() => setSelectedSprint(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedNode.tasks.length > 0 ? (
              <div className="space-y-2">
                {selectedNode.tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/sprint/task/${task.id}`}
                    className="flex items-center justify-between p-3 glass-subtle rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-accent flex-shrink-0">{task.id}</span>
                      <span className="truncate">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Priority dots */}
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 4 }).map((_, i) => {
                          const dots = task.priority === 'Urgent' ? 4 : task.priority === 'High' ? 3 : task.priority === 'Medium' ? 2 : 1;
                          return (
                            <div
                              key={i}
                              className={`w-1 h-1 rounded-full ${i < dots ? getPriorityColor(task.priority).replace('text-', 'bg-') : 'bg-white/10'}`}
                            />
                          );
                        })}
                      </div>
                      {/* Status badge */}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>
                        {getStatusDisplayName(task.status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm text-center py-4">
                {selectedNode.isPast ? 'No task history available' : 'No tasks planned yet'}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
