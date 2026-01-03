import Link from 'next/link';
import { fetchSprintData } from '@/lib/sprint-parser';
import SprintHero from '@/components/sprint/SprintHero';
import TaskBoard from '@/components/sprint/TaskBoard';
import SprintTimeline from '@/components/sprint/SprintTimeline';
import DailyLog from '@/components/sprint/DailyLog';

// Revalidate every 30 seconds for near real-time Linear status updates
export const revalidate = 30;

export const metadata = {
  title: 'Sprint Dashboard - NutriKit',
  description: 'Track the current NutriKit development sprint progress',
};

export default async function SprintPage() {
  let sprintData;
  let error = null;

  try {
    sprintData = await fetchSprintData();
  } catch (e) {
    console.error('Failed to fetch sprint data:', e);
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-subtle">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold gradient-text-accent">
              NutriKit
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/sprint" className="text-sm font-medium text-accent">
                Sprint
              </Link>
            </div>
            <Link
              href="https://apps.apple.com/app/nutrikit"
              className="glass-button inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-full"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {error ? (
          <ErrorState error={error} />
        ) : sprintData ? (
          <>
            <SprintHero sprint={sprintData.current} />
            <TaskBoard tasks={sprintData.current.tasks} />
            <SprintTimeline
              currentSprint={sprintData.current.info}
              config={sprintData.config}
              currentTasks={sprintData.current.tasks}
              plannedSprints={sprintData.plannedSprints}
            />
            <DailyLog entries={sprintData.current.dailyLog} />

            {/* Blockers section if any */}
            {sprintData.current.blockers && !sprintData.current.blockers.includes('Track any blockers') && (
              <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-2xl font-bold mb-6">Blockers & Discoveries</h2>
                  <div className="glass rounded-2xl p-6">
                    <p className="text-foreground/90 whitespace-pre-wrap">{sprintData.current.blockers}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Last updated */}
            <div className="py-8 text-center">
              <p className="text-xs text-muted-foreground">
                Task statuses sync live from Linear every 30 seconds
              </p>
            </div>
          </>
        ) : (
          <LoadingState />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-subtle py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="text-xl font-bold gradient-text-accent">
              NutriKit
            </Link>
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} NutriKit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-strong rounded-3xl p-12">
          <div className="text-6xl mb-6">😅</div>
          <h2 className="text-2xl font-bold mb-4">Couldn&apos;t load sprint data</h2>
          <p className="text-muted mb-6">
            There was an issue fetching the current sprint information.
          </p>
          <code className="block text-sm text-red-400 bg-white/5 p-4 rounded-xl mb-6 overflow-x-auto">
            {error}
          </code>
          <Link
            href="/"
            className="glass-button inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full"
          >
            Return Home
          </Link>
        </div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-strong rounded-3xl p-12">
          <div className="text-6xl mb-6 animate-pulse">⏳</div>
          <h2 className="text-2xl font-bold mb-4">Loading sprint data...</h2>
          <p className="text-muted">Please wait while we fetch the latest sprint information.</p>
        </div>
      </div>
    </section>
  );
}
