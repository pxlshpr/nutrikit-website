'use client';

import { SprintData, getSprintName, calculateProgress, formatDate } from '@/lib/sprint-parser';

interface SprintHeroProps {
  sprint: SprintData;
}

// Calculate days remaining until end date
function getDaysRemaining(endDateStr: string): { days: number; isOverdue: boolean } {
  // Parse date like "Mon, Jan 6, 2026"
  const parts = endDateStr.match(/(\w+), (\w+) (\d+), (\d+)/);
  if (!parts) return { days: 0, isOverdue: false };

  const monthMap: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const month = monthMap[parts[2]];
  const day = parseInt(parts[3]);
  const year = parseInt(parts[4]);

  const endDate = new Date(year, month, day, 23, 59, 59);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    days: Math.abs(diffDays),
    isOverdue: diffDays < 0,
  };
}

export default function SprintHero({ sprint }: SprintHeroProps) {
  const { info, tasks } = sprint;
  const progress = calculateProgress(tasks);
  const sprintName = getSprintName(info.number);
  const completedTasks = tasks.filter(t => t.status === 'Done' || t.status === 'Testing').length;
  const { days: daysRemaining, isOverdue } = getDaysRemaining(info.endDate);

  // SVG circle calculations
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <section className="relative pt-8 pb-12 md:pt-12 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-protein/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left side: Sprint info */}
            <div className="flex-1 text-center lg:text-left">
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 glass-subtle px-4 py-2 rounded-full text-sm font-medium text-accent mb-4">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
                {info.status === 'ACTIVE' ? 'Sprint Active' : info.status}
              </div>

              {/* Sprint number */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <span className="text-muted text-lg font-medium">SPRINT {info.number}</span>
              </div>

              {/* Sprint name (Heroku-style) */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text mb-4 font-mono">
                {sprintName}
              </h1>

              {/* Sprint theme */}
              <p className="text-muted text-lg mb-4">{info.theme}</p>

              {/* ETA Banner - Prominent */}
              <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl ${
                isOverdue
                  ? 'bg-red-500/20 border border-red-500/30'
                  : daysRemaining <= 1
                    ? 'bg-carbs/20 border border-carbs/30'
                    : 'bg-accent/10 border border-accent/20'
              }`}>
                <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-left">
                  <div className={`text-sm font-medium ${
                    isOverdue ? 'text-red-400' : daysRemaining <= 1 ? 'text-carbs-light' : 'text-accent-light'
                  }`}>
                    {isOverdue ? 'OVERDUE' : 'ETA'}
                  </div>
                  <div className="text-lg font-bold">
                    {isOverdue
                      ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} overdue`
                      : daysRemaining === 0
                        ? 'Due today'
                        : daysRemaining === 1
                          ? '1 day remaining'
                          : `${daysRemaining} days remaining`
                    }
                  </div>
                </div>
              </div>

              {/* Date range */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-muted mt-4 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(info.startDate)}</span>
                <span className="text-muted-foreground">-</span>
                <span className="font-semibold text-foreground">{formatDate(info.endDate)}</span>
              </div>

              {/* Sprint type badge */}
              <div className="mt-3 inline-flex items-center gap-2 glass-subtle px-3 py-1.5 rounded-full text-xs font-medium">
                <span className={info.type === 'A' ? 'text-protein' : 'text-carbs'}>
                  Type {info.type}
                </span>
                <span className="text-muted-foreground">
                  {info.type === 'A' ? '(Sat-Mon)' : '(Tue-Thu)'}
                </span>
              </div>
            </div>

            {/* Right side: Progress ring */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                  {/* Background circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--accent)" />
                      <stop offset="50%" stopColor="var(--protein)" />
                      <stop offset="100%" stopColor="var(--fat)" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl md:text-5xl font-bold">{progress}%</div>
                  <div className="text-xs text-muted mt-1">Complete</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {completedTasks} / {tasks.length} tasks
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sprint goal */}
          {sprint.goal && (
            <div className="relative z-10 mt-8 pt-8 border-t border-white/10">
              <h3 className="text-sm font-medium text-muted mb-2">SPRINT GOAL</h3>
              <p className="text-lg text-foreground/90">{sprint.goal}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
