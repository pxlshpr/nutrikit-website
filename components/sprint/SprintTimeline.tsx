'use client';

import { SprintConfig, SprintInfo, getCharacterEmoji } from '@/lib/sprint-parser';

interface SprintTimelineProps {
  currentSprint: SprintInfo;
  config: SprintConfig;
}

interface TimelineNode {
  sprint: number;
  character: string;
  universe: 'Zelda' | 'Mario';
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
}

export default function SprintTimeline({ currentSprint, config }: SprintTimelineProps) {
  const currentSprintNum = currentSprint.number;

  // Generate timeline nodes: 2 past + current + 4 future
  const nodes: TimelineNode[] = [];

  for (let i = Math.max(1, currentSprintNum - 2); i <= currentSprintNum + 4; i++) {
    const charInfo = config.characters.find(c => c.sprint === i) || {
      sprint: i,
      character: `sprint-${i}`,
      universe: i % 2 === 1 ? 'Zelda' as const : 'Mario' as const,
    };

    nodes.push({
      sprint: i,
      character: charInfo.character.charAt(0).toUpperCase() + charInfo.character.slice(1),
      universe: charInfo.universe,
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
          <p className="text-muted text-sm">3-day sprints alternating between Zelda and Mario themes</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-1/2" />

          {/* Timeline nodes */}
          <div className="relative flex justify-between items-center py-8">
            {nodes.map((node, index) => (
              <div
                key={node.sprint}
                className={`flex flex-col items-center transition-all duration-300 ${
                  node.isCurrent ? 'scale-110 z-10' : node.isFuture ? 'opacity-50' : 'opacity-70'
                }`}
              >
                {/* Node circle */}
                <div
                  className={`
                    relative w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${node.isCurrent
                      ? 'glass-accent scale-110 ring-2 ring-accent/50 ring-offset-2 ring-offset-background'
                      : node.isPast
                        ? 'glass-subtle'
                        : 'glass border-dashed'
                    }
                  `}
                >
                  {/* Character emoji */}
                  <span className="text-xl md:text-2xl">
                    {getCharacterEmoji(node.character.toLowerCase())}
                  </span>

                  {/* Current indicator pulse */}
                  {node.isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
                  )}
                </div>

                {/* Sprint info */}
                <div className={`mt-3 text-center ${node.isCurrent ? '' : 'hidden sm:block'}`}>
                  <div className={`text-xs font-medium ${
                    node.isCurrent ? 'text-accent' : 'text-muted-foreground'
                  }`}>
                    Sprint {node.sprint}
                  </div>
                  <div className={`text-sm font-semibold ${
                    node.isCurrent ? 'text-foreground' : 'text-muted'
                  }`}>
                    {node.character}
                  </div>
                  {node.isCurrent && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-accent/20 text-accent text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      NOW
                    </div>
                  )}
                </div>

                {/* Universe indicator */}
                <div className={`mt-1 text-xs ${
                  node.universe === 'Zelda' ? 'text-protein' : 'text-carbs'
                } ${node.isCurrent ? '' : 'hidden md:block'}`}>
                  {node.universe}
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
            <div className="w-3 h-3 rounded-full bg-protein/40" />
            <span>Zelda Universe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-carbs/40" />
            <span>Mario Universe</span>
          </div>
        </div>
      </div>
    </section>
  );
}
