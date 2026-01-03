'use client';

import { SprintData, getCharacterEmoji, calculateProgress, formatDate } from '@/lib/sprint-parser';

interface SprintHeroProps {
  sprint: SprintData;
}

export default function SprintHero({ sprint }: SprintHeroProps) {
  const { info, tasks } = sprint;
  const progress = calculateProgress(tasks);
  const emoji = getCharacterEmoji(info.character);
  const completedTasks = tasks.filter(t => t.status === 'Done' || t.status === 'Testing').length;

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

              {/* Sprint number and emoji */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <span className="text-4xl md:text-5xl">{emoji}</span>
                <span className="text-muted text-lg font-medium">SPRINT {info.number}</span>
              </div>

              {/* Character name */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight gradient-text mb-4">
                {info.character}
              </h1>

              {/* Sprint details */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-muted">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(info.startDate)} - {formatDate(info.endDate)}
                </span>
                <span className="hidden sm:inline text-muted-foreground">|</span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {info.theme}
                </span>
              </div>

              {/* Sprint type badge */}
              <div className="mt-4 inline-flex items-center gap-2 glass-subtle px-3 py-1.5 rounded-full text-xs font-medium">
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
