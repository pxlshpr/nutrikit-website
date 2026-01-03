'use client';

import { useState } from 'react';
import { DailyLogEntry } from '@/lib/sprint-parser';

interface DailyLogProps {
  entries: DailyLogEntry[];
}

function DayCard({ entry, isExpanded, onToggle }: {
  entry: DailyLogEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const hasContent = entry.morningStandup || entry.eodSummary || entry.midDayCheckIn || entry.buildSubmitted;

  // Determine day status
  const today = new Date();
  const entryDate = new Date(entry.date + ', 2026');
  const isToday = today.toDateString() === entryDate.toDateString();
  const isPast = entryDate < today && !isToday;
  const isFuture = entryDate > today;

  return (
    <div
      className={`
        glass rounded-2xl overflow-hidden transition-all duration-300
        ${isToday ? 'ring-2 ring-accent/50' : ''}
        ${isFuture ? 'opacity-50' : ''}
      `}
    >
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Day number badge */}
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold
            ${isToday
              ? 'bg-accent/20 text-accent'
              : isPast
                ? hasContent ? 'bg-success/20 text-success' : 'bg-white/10 text-muted'
                : 'bg-white/5 text-muted-foreground'
            }
          `}>
            {entry.day}
          </div>

          {/* Day info */}
          <div>
            <div className="font-medium flex items-center gap-2">
              Day {entry.day}
              {isToday && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Today
                </span>
              )}
            </div>
            <div className="text-sm text-muted">
              {entry.dayName}, {entry.date}
            </div>
          </div>
        </div>

        {/* Status indicator & expand arrow */}
        <div className="flex items-center gap-3">
          {hasContent && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted">
              {entry.morningStandup && (
                <span className="px-2 py-0.5 rounded-full bg-white/10">AM</span>
              )}
              {entry.eodSummary && (
                <span className="px-2 py-0.5 rounded-full bg-white/10">EOD</span>
              )}
              {entry.buildSubmitted && (
                <span className="px-2 py-0.5 rounded-full bg-success/20 text-success">Build</span>
              )}
            </div>
          )}

          <svg
            className={`w-5 h-5 text-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isExpanded ? 'max-h-96' : 'max-h-0'}
        `}
      >
        <div className="px-4 pb-4 space-y-3">
          {entry.morningStandup && (
            <LogEntry
              label="Morning Standup"
              content={entry.morningStandup}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
          )}

          {entry.midDayCheckIn && (
            <LogEntry
              label="Mid-day Check-in"
              content={entry.midDayCheckIn}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          )}

          {entry.eodSummary && (
            <LogEntry
              label="End of Day Summary"
              content={entry.eodSummary}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              }
            />
          )}

          {entry.buildSubmitted && (
            <LogEntry
              label="Build Submitted"
              content={entry.buildSubmitted}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              }
              highlight
            />
          )}

          {!hasContent && (
            <div className="text-sm text-muted-foreground italic py-2">
              No log entries for this day yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LogEntry({ label, content, icon, highlight }: {
  label: string;
  content: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`
      p-3 rounded-xl
      ${highlight ? 'bg-success/10 border border-success/20' : 'bg-white/5'}
    `}>
      <div className={`flex items-center gap-2 text-xs font-medium mb-1 ${highlight ? 'text-success' : 'text-muted'}`}>
        {icon}
        {label}
      </div>
      <p className="text-sm text-foreground/90">{content}</p>
    </div>
  );
}

export default function DailyLog({ entries }: DailyLogProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Auto-expand today or the first day with content
  const today = new Date();
  const todayEntry = entries.find(e => {
    const entryDate = new Date(e.date + ', 2026');
    return today.toDateString() === entryDate.toDateString();
  });

  const defaultExpanded = todayEntry?.day || entries.find(e =>
    e.morningStandup || e.eodSummary || e.midDayCheckIn || e.buildSubmitted
  )?.day || null;

  const handleToggle = (day: number) => {
    setExpandedDay(prev => prev === day ? null : day);
  };

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Daily Log</h2>
          <span className="text-sm text-muted">{entries.length} days</span>
        </div>

        {/* Day cards */}
        <div className="space-y-3">
          {entries.map((entry) => (
            <DayCard
              key={entry.day}
              entry={entry}
              isExpanded={expandedDay === entry.day || (expandedDay === null && entry.day === defaultExpanded)}
              onToggle={() => handleToggle(entry.day)}
            />
          ))}
        </div>

        {/* Empty state */}
        {entries.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">📔</div>
            <h3 className="text-lg font-medium mb-2">No daily logs yet</h3>
            <p className="text-muted text-sm">Daily standups and summaries will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
