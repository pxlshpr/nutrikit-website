'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SprintConfig, SprintInfo, SprintTask, getSprintName, getStatusColor, getPriorityColor } from '@/lib/sprint-parser';

// Sprint number offset to imply years of work (must match SprintHero)
const SPRINT_OFFSET = 46;

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
  const currentSprintNum = currentSprint.number;

  // Distribute tasks across sprints
  const sprintTaskMap = distributeTasks(currentSprintNum, currentTasks, allTasks);

  // Generate timeline nodes: 2 past + current + enough future to show all planned tasks
  const maxFutureSprint = Math.max(
    currentSprintNum + 4,
    ...Array.from(sprintTaskMap.keys())
  );

  const nodes: TimelineNode[] = [];

  for (let i = Math.max(1, currentSprintNum - 2); i <= maxFutureSprint; i++) {
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

  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Sprint Timeline</h2>
          <p className="text-muted text-sm">Tap a sprint to see its tasks</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-1/2" />

          {/* Timeline nodes - scrollable on mobile */}
          <div className="relative flex justify-start sm:justify-between items-center py-8 overflow-x-auto gap-4 sm:gap-0 px-4 sm:px-0">
            {nodes.map((node) => (
              <button
                key={node.sprint}
                onClick={() => setSelectedSprint(selectedSprint === node.sprint ? null : node.sprint)}
                className={`flex-shrink-0 flex flex-col items-center transition-all duration-300 ${
                  node.isCurrent ? 'scale-110 z-10' : node.isFuture ? 'opacity-60 hover:opacity-100' : 'opacity-70 hover:opacity-100'
                } ${selectedSprint === node.sprint ? 'scale-110' : ''}`}
              >
                {/* Node circle */}
                <div
                  className={`
                    relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center
                    transition-all duration-300 font-mono text-sm font-bold cursor-pointer
                    hover:ring-2 hover:ring-accent/30
                    ${selectedSprint === node.sprint
                      ? 'ring-2 ring-accent ring-offset-2 ring-offset-background'
                      : ''
                    }
                    ${node.isCurrent
                      ? 'glass-accent scale-110 ring-2 ring-accent/50 ring-offset-2 ring-offset-background'
                      : node.isPast
                        ? 'glass-subtle'
                        : 'glass border-dashed'
                    }
                  `}
                >
                  {/* Sprint number */}
                  <span className={node.isCurrent || selectedSprint === node.sprint ? 'text-accent' : 'text-muted'}>
                    {node.displayNumber}
                  </span>

                  {/* Task count badge */}
                  {node.tasks.length > 0 && (
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
                    node.isCurrent || selectedSprint === node.sprint ? 'text-accent' : 'text-muted-foreground'
                  }`}>
                    {node.name}
                  </div>
                  {node.isCurrent && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-accent/20 text-accent text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      NOW
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

          {/* Decorative arrows */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-muted-foreground/30 hidden sm:block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
            <span>Planned</span>
          </div>
        </div>
      </div>
    </section>
  );
}
