'use client';

import { SprintConfig, SprintInfo, getSprintName } from '@/lib/sprint-parser';

// Sprint number offset to imply years of work (must match SprintHero)
const SPRINT_OFFSET = 46;

interface SprintTimelineProps {
  currentSprint: SprintInfo;
  config: SprintConfig;
}

interface TimelineNode {
  sprint: number;
  displayNumber: number;
  name: string;
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
}

export default function SprintTimeline({ currentSprint }: SprintTimelineProps) {
  const currentSprintNum = currentSprint.number;

  // Generate timeline nodes: 2 past + current + 4 future
  const nodes: TimelineNode[] = [];

  for (let i = Math.max(1, currentSprintNum - 2); i <= currentSprintNum + 4; i++) {
    const displayNumber = i + SPRINT_OFFSET;
    nodes.push({
      sprint: i,
      displayNumber,
      name: getSprintName(displayNumber),
      isCurrent: i === currentSprintNum,
      isPast: i < currentSprintNum,
      isFuture: i > currentSprintNum,
    });
  }

  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Sprint Timeline</h2>
          <p className="text-muted text-sm">3-day development sprints</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-1/2" />

          {/* Timeline nodes */}
          <div className="relative flex justify-between items-center py-8">
            {nodes.map((node) => (
              <div
                key={node.sprint}
                className={`flex flex-col items-center transition-all duration-300 ${
                  node.isCurrent ? 'scale-110 z-10' : node.isFuture ? 'opacity-50' : 'opacity-70'
                }`}
              >
                {/* Node circle */}
                <div
                  className={`
                    relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center
                    transition-all duration-300 font-mono text-sm font-bold
                    ${node.isCurrent
                      ? 'glass-accent scale-110 ring-2 ring-accent/50 ring-offset-2 ring-offset-background'
                      : node.isPast
                        ? 'glass-subtle'
                        : 'glass border-dashed'
                    }
                  `}
                >
                  {/* Sprint number */}
                  <span className={node.isCurrent ? 'text-accent' : 'text-muted'}>
                    {node.displayNumber}
                  </span>

                  {/* Current indicator pulse */}
                  {node.isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
                  )}
                </div>

                {/* Sprint info */}
                <div className={`mt-3 text-center ${node.isCurrent ? '' : 'hidden sm:block'}`}>
                  <div className={`text-xs font-mono ${
                    node.isCurrent ? 'text-accent' : 'text-muted-foreground'
                  }`}>
                    {node.name}
                  </div>
                  {node.isCurrent && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-accent/20 text-accent text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      NOW
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Decorative arrows */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-muted-foreground/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full glass-subtle" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent/40 ring-1 ring-accent/50" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full glass border border-dashed border-white/20" />
            <span>Upcoming</span>
          </div>
        </div>
      </div>
    </section>
  );
}
