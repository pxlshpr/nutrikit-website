'use client';

import { useState, useEffect } from 'react';
import { SprintData, getSprintName, calculateProgress } from '@/lib/sprint-parser';

interface SprintHeroProps {
  sprint: SprintData;
}

// Block number offset (adjusts display number from file number)
const BLOCK_OFFSET = 0;

// Get current time in Maldives (UTC+5)
function getMaldivesNow(): Date {
  const now = new Date();
  // Create a date object representing Maldives time
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + 5 * 60 * 60 * 1000); // UTC+5
}

// Calculate sprint dates based on type (A=Sat-Mon, B=Tue-Thu) for current week
function getSprintDates(type: 'A' | 'B'): { start: Date; end: Date } {
  const now = getMaldivesNow();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // For Type A (Sat-Mon): Saturday=6, Sunday=0, Monday=1
  // For Type B (Tue-Thu): Tuesday=2, Wednesday=3, Thursday=4

  let startDayOffset: number;

  if (type === 'A') {
    // Find Saturday of current sprint week
    // If we're on Sat(6), Sun(0), or Mon(1), we're in an active A sprint
    if (dayOfWeek === 6) {
      startDayOffset = 0; // Today is Saturday
    } else if (dayOfWeek === 0) {
      startDayOffset = -1; // Yesterday was Saturday
    } else if (dayOfWeek === 1) {
      startDayOffset = -2; // Saturday was 2 days ago
    } else {
      // We're between Tue-Fri, find previous Saturday
      startDayOffset = -(dayOfWeek + 1);
    }
  } else {
    // Type B: Find Tuesday of current sprint week
    if (dayOfWeek === 2) {
      startDayOffset = 0; // Today is Tuesday
    } else if (dayOfWeek === 3) {
      startDayOffset = -1; // Yesterday was Tuesday
    } else if (dayOfWeek === 4) {
      startDayOffset = -2; // Tuesday was 2 days ago
    } else {
      // We're on Fri, Sat, Sun, or Mon - find previous or next Tuesday
      startDayOffset = 2 - dayOfWeek;
      if (startDayOffset > 0) startDayOffset -= 7; // Go to previous week's Tuesday
    }
  }

  const start = new Date(now);
  start.setDate(start.getDate() + startDayOffset);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 2); // 3-day sprint: Sat-Mon or Tue-Thu

  return { start, end };
}

// Calculate time remaining until midnight Maldives time on end date
function getTimeRemaining(endDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOverdue: boolean;
  totalMs: number;
} {
  const maldivesNow = getMaldivesNow();

  // End of sprint day (midnight = end of the day)
  const endMidnight = new Date(endDate);
  endMidnight.setHours(23, 59, 59, 999);

  const diffMs = endMidnight.getTime() - maldivesNow.getTime();
  const isOverdue = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);

  const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiffMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isOverdue, totalMs: diffMs };
}

// Format date range nicely (e.g., "Jan 3-5, 2026" or "Dec 30 - Jan 1, 2026")
function formatDateRange(start: Date, end: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonth = months[start.getMonth()];
  const endMonth = months[end.getMonth()];
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    // Same month: "Jan 3-5, 2026"
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  } else if (start.getFullYear() === end.getFullYear()) {
    // Different months, same year: "Dec 30 - Jan 1, 2026"
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  } else {
    // Different years: "Dec 30, 2025 - Jan 1, 2026"
    return `${startMonth} ${startDay}, ${start.getFullYear()} - ${endMonth} ${endDay}, ${year}`;
  }
}

export default function SprintHero({ sprint }: SprintHeroProps) {
  const { info, tasks } = sprint;
  const progress = calculateProgress(tasks);
  const displayBlockNumber = info.number + BLOCK_OFFSET;
  const blockName = getSprintName(displayBlockNumber);
  const completedTasks = tasks.filter(t => t.status === 'Done' || t.status === 'Testing').length;

  // Use dates from the markdown file instead of calculating dynamically
  const sprintStart = new Date(info.startDate);
  const sprintEnd = new Date(info.endDate);

  // State for countdown that updates every second
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(sprintEnd));

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(sprintEnd));
    }, 1000);

    return () => clearInterval(interval);
  }, [sprintEnd]);

  const { days, hours, minutes, seconds, isOverdue, totalMs } = timeRemaining;

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
              <div className="inline-flex items-center gap-3 glass-subtle px-5 py-2.5 rounded-full text-sm font-semibold text-accent mb-4 border-2 border-accent/60 shadow-[0_0_12px_rgba(124,58,237,0.25)] dark:shadow-[0_0_20px_var(--accent)]">
                <div className="relative flex-shrink-0 w-[21px] h-[21px]">
                  {/* Pulsing ring - 1.75x size */}
                  <div className="absolute inset-0 rounded-full bg-orange-500 opacity-75 animate-ping"></div>
                  {/* Solid center dot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full z-10 sprint-pulse-dot"></div>
                </div>
                {info.status === 'ACTIVE' ? 'Active Now' : info.status}
              </div>

              {/* Block number */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <span className="text-muted text-lg font-medium">BLOCK {displayBlockNumber}</span>
              </div>

              {/* Block name (Heroku-style) */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text mb-4 font-mono">
                {blockName}
              </h1>

              {/* Block theme */}
              <p className="text-muted text-lg mb-4">{info.theme}</p>

              {/* Countdown Banner - Prominent */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-accent/10 border border-accent/20">
                <svg className="w-5 h-5 gradient-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs font-medium uppercase tracking-wide gradient-text">
                    {isOverdue ? 'Overdue' : 'Time Remaining'}
                  </div>
                  <div className="text-xl font-bold font-mono gradient-text" suppressHydrationWarning>
                    {isOverdue ? (
                      <span suppressHydrationWarning>
                        +{days}d {hours}h {minutes}m {seconds}s
                      </span>
                    ) : (
                      <span suppressHydrationWarning>
                        {days}d {hours}h {minutes}m {seconds}s
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
                <span>{formatDateRange(sprintStart, sprintEnd)}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {info.type === 'A' ? 'Sat-Mon' : 'Tue-Thu'}
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
                    stroke="rgba(0,0,0,0.08)"
                    className="dark:stroke-white/10"
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
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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

          {/* Block goal */}
          {sprint.goal && (
            <div className="relative z-10 mt-8 pt-8 border-t border-foreground/10">
              <h3 className="text-sm font-medium text-muted mb-2">CURRENT FOCUS</h3>
              <p className="text-lg text-foreground/90">{sprint.goal}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
