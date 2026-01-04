'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SprintConfig, SprintInfo, SprintTask, PlannedSprint, getSprintName, getStatusColor, getPriorityColor } from '@/lib/sprint-parser';

// Block number offset (adjusts display number from file number)
const BLOCK_OFFSET = -45;

interface SprintTimelineProps {
  currentSprint: SprintInfo;
  config: SprintConfig;
  currentTasks: SprintTask[];
  plannedSprints?: PlannedSprint[]; // Future sprint plans from planned-sprints.md
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
  const statusMap: Record<SprintTask['status'], string> = {
    'Ready': 'Ready to Start',
    'Running': 'Working On It',
    'Testing': 'Being Tested',
    'Done': 'Completed',
    'Backlog': 'Backlog',
    'Todo': 'To Do',
    'Queue': 'Queued',
    'Canceled': 'Canceled',
  };
  return statusMap[status] || status;
}

// Build task map from current sprint and planned sprints
function buildSprintTaskMap(
  currentSprintNum: number,
  currentTasks: SprintTask[],
  plannedSprints: PlannedSprint[]
): Map<number, SprintTask[]> {
  const sprintTaskMap = new Map<number, SprintTask[]>();

  // Current sprint gets its actual tasks
  sprintTaskMap.set(currentSprintNum, currentTasks);

  // Add planned sprints from the markdown file
  for (const planned of plannedSprints) {
    sprintTaskMap.set(planned.number, planned.tasks);
  }

  return sprintTaskMap;
}

export default function SprintTimeline({ currentSprint, currentTasks, plannedSprints = [] }: SprintTimelineProps) {
  const [selectedSprint, setSelectedSprint] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const currentSprintNum = currentSprint.number;

  // Build task map from current sprint and planned sprints file
  const sprintTaskMap = buildSprintTaskMap(currentSprintNum, currentTasks, plannedSprints);

  // Generate timeline nodes: start from CURRENT sprint, show current + future only
  const maxFutureSprint = Math.max(
    currentSprintNum + 4,
    ...Array.from(sprintTaskMap.keys())
  );

  const nodes: TimelineNode[] = [];

  // Start from current block (no past blocks)
  for (let i = currentSprintNum; i <= maxFutureSprint; i++) {
    const displayNumber = i + BLOCK_OFFSET;
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
          <h2 className="text-2xl font-bold mb-2">What's Coming Next</h2>
          <p className="text-muted text-sm">Tap a block to see its tasks</p>
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
          <div className="absolute top-[52px] left-12 right-12 h-0.5 bg-gradient-to-r from-foreground/20 via-foreground/15 to-foreground/5" />

          {/* Fade edges for scroll indication */}
          <div className={`absolute left-10 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute right-10 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

          {/* Timeline nodes - scrollable */}
          <div
            ref={scrollContainerRef}
            className="relative flex items-start py-6 overflow-x-auto gap-6 px-14 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {nodes.map((node) => (
              <button
                key={node.sprint}
                onClick={() => setSelectedSprint(selectedSprint === node.sprint ? null : node.sprint)}
                className="flex-shrink-0 flex flex-col items-center transition-all duration-300 w-16"
              >
                {/* Node circle with distinct states */}
                <div
                  className={`
                    relative w-14 h-14 rounded-full flex items-center justify-center
                    transition-all duration-300 font-mono text-sm font-bold cursor-pointer
                    ${selectedSprint === node.sprint
                      ? 'ring-2 ring-accent ring-offset-2 ring-offset-background scale-110'
                      : 'hover:scale-105'
                    }
                    ${node.isCurrent
                      ? 'bg-orange-500 shadow-[0_0_24px_rgba(249,115,22,0.6)]'
                      : node.isPast
                        ? 'bg-success'
                        : 'bg-transparent border-2 border-dashed border-foreground/30 hover:border-foreground/50'
                    }
                  `}
                >
                  {/* Sprint number */}
                  <span className={
                    node.isCurrent
                      ? 'text-white font-bold'
                      : node.isPast
                        ? 'text-white font-bold'
                        : 'text-foreground/60'
                  }>
                    {node.displayNumber}
                  </span>

                  {/* Task count badge */}
                  {node.tasks.length > 0 && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                      node.isCurrent
                        ? 'bg-white text-orange-500'
                        : node.isPast
                          ? 'bg-white text-success'
                          : 'bg-white text-gray-800 border border-foreground/20'
                    }`}>
                      {node.tasks.length}
                    </div>
                  )}

                  {/* Checkmark for completed */}
                  {node.isPast && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {/* Current indicator pulse */}
                  {node.isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-orange-500/40 animate-ping" />
                  )}
                </div>

                {/* Sprint name - always visible */}
                <div className="mt-3 text-center">
                  <div className={`text-xs font-mono capitalize ${
                    node.isCurrent
                      ? 'text-orange-600 dark:text-orange-400'
                      : node.isPast
                        ? 'text-success'
                        : 'text-foreground/50'
                  }`}>
                    {node.name}
                  </div>
                  {/* Status label */}
                  <div className={`text-[10px] mt-0.5 ${
                    node.isCurrent
                      ? 'text-orange-600/80 dark:text-orange-400/80'
                      : node.isPast
                        ? 'text-success/70'
                        : 'text-foreground/30'
                  }`}>
                    {node.isCurrent ? 'active' : node.isPast ? 'done' : 'planned'}
                  </div>
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
                <div className="inline-flex items-baseline gap-2 bg-accent/10 border border-accent/30 rounded-2xl px-3 py-1.5 mb-2">
                  <span className="text-sm font-medium">Block {selectedNode.displayNumber}</span>
                  <h3 className="text-lg font-bold gradient-text font-mono">
                    {selectedNode.name}
                  </h3>
                </div>
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
                    className="flex items-start gap-3 p-3 glass-subtle rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <span className="text-xs font-mono text-accent flex-shrink-0">{task.id}</span>
                    <span className="flex-1 min-w-0">{task.title}</span>
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
