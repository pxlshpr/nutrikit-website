'use client';

import Link from 'next/link';
import { SprintTask, getStatusColor, getPriorityColor } from '@/lib/sprint-parser';

interface TaskBoardProps {
  tasks: SprintTask[];
}

// Display names for statuses (rename "Prompt Ready" to indicate Claude readiness)
function getStatusDisplayName(status: SprintTask['status']): string {
  if (status === 'Prompt Ready') return 'Claudable';
  return status;
}

function StatusIcon({ status }: { status: SprintTask['status'] }) {
  switch (status) {
    case 'Done':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'Running':
      return (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'Testing':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'Prompt Ready':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
        </svg>
      );
  }
}

function PriorityIndicator({ priority }: { priority: SprintTask['priority'] }) {
  const dots = priority === 'Urgent' ? 4 : priority === 'High' ? 3 : priority === 'Medium' ? 2 : 1;
  const color = getPriorityColor(priority);

  return (
    <div className="flex items-center gap-0.5" title={`${priority} Priority`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i < dots ? color.replace('text-', 'bg-') : 'bg-white/10'}`}
        />
      ))}
    </div>
  );
}

function TaskCard({ task }: { task: SprintTask }) {
  const statusColorClass = getStatusColor(task.status);
  const isDone = task.status === 'Done';
  const isRunning = task.status === 'Running';

  return (
    <Link
      href={`/sprint/task/${task.id}`}
      className={`
        block glass feature-card rounded-2xl p-5 relative overflow-hidden
        hover:ring-2 hover:ring-accent/30 transition-all cursor-pointer
        ${isRunning ? 'ring-2 ring-protein/50' : ''}
        ${isDone ? 'opacity-75' : ''}
      `}
    >
      {/* Running indicator */}
      {isRunning && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-protein via-accent to-protein animate-shimmer" />
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Left: Task info */}
        <div className="flex-1 min-w-0">
          {/* Task ID */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-accent">
              {task.id}
            </span>
            <PriorityIndicator priority={task.priority} />
          </div>

          {/* Task title */}
          <h3 className={`font-medium leading-snug ${isDone ? 'line-through text-muted' : ''}`}>
            {task.title}
          </h3>
        </div>

        {/* Right: Status badge */}
        <div className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusColorClass}`}>
          <StatusIcon status={task.status} />
          <span className="hidden sm:inline">{getStatusDisplayName(task.status)}</span>
        </div>
      </div>

      {/* Tap indicator */}
      <div className="absolute bottom-2 right-2 text-muted-foreground/30">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default function TaskBoard({ tasks }: TaskBoardProps) {
  // Group tasks by status for summary
  const statusGroups = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort tasks: Running first, then by priority, then alphabetically
  const sortedTasks = [...tasks].sort((a, b) => {
    // Running tasks first
    if (a.status === 'Running' && b.status !== 'Running') return -1;
    if (b.status === 'Running' && a.status !== 'Running') return 1;

    // Done tasks last
    if (a.status === 'Done' && b.status !== 'Done') return 1;
    if (b.status === 'Done' && a.status !== 'Done') return -1;

    // Then by priority
    const priorityOrder: Record<string, number> = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3, 'None': 4 };
    const priorityDiff = (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    if (priorityDiff !== 0) return priorityDiff;

    // Then alphabetically
    return a.title.localeCompare(b.title);
  });

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Sprint Tasks
          </h2>

          {/* Status summary pills */}
          <div className="hidden sm:flex items-center gap-2">
            {statusGroups['Running'] && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-protein/20 text-protein-light border border-protein/30">
                <span className="w-1.5 h-1.5 rounded-full bg-protein animate-pulse" />
                {statusGroups['Running']} Running
              </span>
            )}
            {statusGroups['Prompt Ready'] && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent-light border border-accent/30">
                {statusGroups['Prompt Ready']} Claudable
              </span>
            )}
            {statusGroups['Testing'] && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-carbs/20 text-carbs-light border border-carbs/30">
                {statusGroups['Testing']} Testing
              </span>
            )}
            {statusGroups['Done'] && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/20 text-success-light border border-success/30">
                {statusGroups['Done']} Done
              </span>
            )}
          </div>
        </div>

        {/* Task cards grid */}
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
            <p className="text-muted text-sm">Tasks will appear here once the sprint is planned.</p>
          </div>
        )}
      </div>
    </section>
  );
}
