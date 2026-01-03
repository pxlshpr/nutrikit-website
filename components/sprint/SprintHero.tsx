'use client';

import { SprintData, getSprintName, calculateProgress } from '@/lib/sprint-parser';

interface SprintHeroProps {
  sprint: SprintData;
}

// Sprint number offset to imply years of work
const SPRINT_OFFSET = 46;

// Parse date string like "Mon, Jan 6, 2026"
function parseDate(dateStr: string): Date | null {
  const parts = dateStr.match(/(\w+), (\w+) (\d+), (\d+)/);
  if (!parts) return null;

  const monthMap: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const month = monthMap[parts[2]];
  const day = parseInt(parts[3]);
  const year = parseInt(parts[4]);

  return new Date(year, month, day);
}

// Calculate time remaining until midnight Maldives time (UTC+5) on end date
function getTimeRemaining(endDateStr: string): {
  days: number;
  hours: number;
  minutes: number;
  isOverdue: boolean;
  totalMs: number;
} {
  const endDate = parseDate(endDateStr);
  if (!endDate) return { days: 0, hours: 0, minutes: 0, isOverdue: false, totalMs: 0 };

  // Get current time in Maldives (UTC+5)
  const now = new Date();
  const maldivesOffset = 5 * 60; // UTC+5 in minutes
  const localOffset = now.getTimezoneOffset(); // Local offset in minutes (negative for ahead of UTC)
  const maldivesNow = new Date(now.getTime() + (maldivesOffset + localOffset) * 60 * 1000);

  // End of sprint day in Maldives time (midnight = end of the day)
  const endMidnight = new Date(endDate);
  endMidnight.setHours(23, 59, 59, 999);

  const diffMs = endMidnight.getTime() - maldivesNow.getTime();
  const isOverdue = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);

  const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isOverdue, totalMs: diffMs };
}

// Format date range nicely (e.g., "Jan 4-6, 2026" or "Dec 30 - Jan 2, 2026")
function formatDateRange(startStr: string, endStr: string): string {
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  if (!start || !end) return `${startStr} - ${endStr}`;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonth = months[start.getMonth()];
  const endMonth = months[end.getMonth()];
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    // Same month: "Jan 4-6, 2026"
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  } else if (start.getFullYear() === end.getFullYear()) {
    // Different months, same year: "Dec 30 - Jan 2, 2026"
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  } else {
    // Different years: "Dec 30, 2025 - Jan 2, 2026"
    return `${startMonth} ${startDay}, ${start.getFullYear()} - ${endMonth} ${endDay}, ${year}`;
  }
}

export default function SprintHero({ sprint }: SprintHeroProps) {
  const { info, tasks } = sprint;
  const progress = calculateProgress(tasks);
  const displaySprintNumber = info.number + SPRINT_OFFSET;
  const sprintName = getSprintName(displaySprintNumber);
  const completedTasks = tasks.filter(t => t.status === 'Done' || t.status === 'Testing').length;
  const { days, hours, minutes, isOverdue, totalMs } = getTimeRemaining(info.endDate);

  // SVG circle calculations
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  // Determine urgency level
  const isUrgent = !isOverdue && totalMs < 24 * 60 * 60 * 1000; // Less than 24 hours
  const isWarning = !isOverdue && !isUrgent && totalMs < 48 * 60 * 60 * 1000; // Less than 48 hours

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
                <span className="text-muted text-lg font-medium">SPRINT {displaySprintNumber}</span>
              </div>

              {/* Sprint name (Heroku-style) */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text mb-4 font-mono">
                {sprintName}
              </h1>

              {/* Sprint theme */}
              <p className="text-muted text-lg mb-4">{info.theme}</p>

              {/* Countdown Banner - Prominent */}
              <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl ${
                isOverdue
                  ? 'bg-red-500/20 border border-red-500/30'
                  : isUrgent
                    ? 'bg-red-500/20 border border-red-500/30'
                    : isWarning
                      ? 'bg-carbs/20 border border-carbs/30'
                      : 'bg-accent/10 border border-accent/20'
              }`}>
                <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-left">
                  <div className={`text-xs font-medium uppercase tracking-wide ${
                    isOverdue ? 'text-red-400' : isUrgent ? 'text-red-400' : isWarning ? 'text-carbs-light' : 'text-accent-light'
                  }`}>
                    {isOverdue ? 'Overdue' : 'Time Remaining'}
                  </div>
                  <div className="text-xl font-bold font-mono">
                    {isOverdue ? (
                      <span className="text-red-400">
                        +{days}d {hours}h {minutes}m
                      </span>
                    ) : (
                      <span>
                        {days}d {hours}h {minutes}m
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Date range */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-muted mt-4 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDateRange(info.startDate, info.endDate)}</span>
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
