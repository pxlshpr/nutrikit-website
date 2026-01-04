import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchTaskDetails, getStatusColorClass, getPriorityColorClass } from '@/lib/linear-client';
import { fetchSprintTaskList, type SprintTask } from '@/lib/sprint-parser';
import MarkdownRenderer from '@/components/sprint/MarkdownRenderer';
import DescriptionSections from '@/components/sprint/DescriptionSections';
import { parseDescription } from '@/lib/parse-description';

// Revalidate every 2 minutes for task details
export const revalidate = 120;

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TaskPageProps) {
  const { id } = await params;
  return {
    title: `${id} - Sprint Dashboard - NutriKit`,
    description: `View details for task ${id}`,
  };
}

interface TaskNavInfo {
  prevTask: SprintTask | null;
  nextTask: SprintTask | null;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;

  let task;
  let error = null;
  let navInfo: TaskNavInfo = { prevTask: null, nextTask: null };

  try {
    // Fetch task details and sprint task list in parallel
    const [taskDetails, sprintTasks] = await Promise.all([
      fetchTaskDetails(id),
      fetchSprintTaskList(),
    ]);

    task = taskDetails;
    if (!task) {
      notFound();
    }

    // Find current task's position and get prev/next tasks
    const currentIndex = sprintTasks.findIndex(t => t.id === id);
    if (currentIndex !== -1) {
      navInfo = {
        prevTask: currentIndex > 0 ? sprintTasks[currentIndex - 1] : null,
        nextTask: currentIndex < sprintTasks.length - 1 ? sprintTasks[currentIndex + 1] : null,
      };
    }
  } catch (e) {
    console.error('Failed to fetch task:', e);
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated Background */}
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      {/* Navigation */}
      <header className="glass-subtle header-safe-area">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-accent">
              NutriKit
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/sprint" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Blocks
              </Link>
            </div>
            <Link
              href="https://apps.apple.com/app/nutrikit"
              className="glass-button inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-foreground rounded-full"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download
            </Link>
          </div>
        </nav>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" style={{ height: `calc(5rem + env(safe-area-inset-top, 0px))` }} />

      <main className="flex-1">
        {error ? (
          <ErrorState error={error} taskId={id} />
        ) : task ? (
          <TaskDetailContent task={task} navInfo={navInfo} />
        ) : (
          <LoadingState />
        )}
      </main>

      {/* Footer */}
      <footer className="pt-8 safe-area-bottom">
        <p className="text-sm text-muted text-center mb-12">
          &copy; {new Date().getFullYear()} NutriKit. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function TaskDetailContent({ task, navInfo }: {
  task: NonNullable<Awaited<ReturnType<typeof fetchTaskDetails>>>;
  navInfo: TaskNavInfo;
}) {
  const statusColor = getStatusColorClass(task.status);
  const priorityColor = getPriorityColorClass(task.priority);
  const parsedDescription = task.description ? parseDescription(task.description) : null;

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/sprint"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blocks
        </Link>

        {/* Task Navigation */}
        {(navInfo.prevTask || navInfo.nextTask) && (
          <TaskNavigation prevTask={navInfo.prevTask} nextTask={navInfo.nextTask} />
        )}

        {/* Task Header */}
        <div className="glass-strong rounded-3xl p-6 md:p-8 mb-6">
          {/* Identifier and badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-accent text-lg">{task.identifier}</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
              {task.status}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${priorityColor}`}>
              <PriorityDots priority={task.priority} />
              {task.priorityLabel}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{task.title}</h1>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {task.assignee && (
              <div>
                <span className="text-muted block mb-1">Assignee</span>
                <div className="flex items-center gap-2">
                  {task.assignee.avatarUrl && (
                    <img
                      src={task.assignee.avatarUrl}
                      alt={task.assignee.name}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span className="font-medium">{task.assignee.name}</span>
                </div>
              </div>
            )}
            {task.estimate && (
              <div>
                <span className="text-muted block mb-1">Estimate</span>
                <span className="font-medium">{task.estimate} points</span>
              </div>
            )}
            {task.dueDate && (
              <div>
                <span className="text-muted block mb-1">Due Date</span>
                <span className="font-medium">{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>

          {/* Labels */}
          {task.labels.length > 0 && (
            <div className="mt-4">
              <span className="text-muted text-sm block mb-2">Labels</span>
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label) => (
                  <span
                    key={label}
                    className="label-tag"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preamble */}
          {parsedDescription?.preamble && (
            <div className="mt-4 pt-4 label-separator text-muted-foreground">
              <MarkdownRenderer content={parsedDescription.preamble} />
            </div>
          )}
        </div>

        {/* Technical Details Header */}
        {parsedDescription?.hasTechnicalDetails && parsedDescription.sections.length > 0 && (
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 mt-2">
            Technical details
          </h2>
        )}

        {/* Description Sections */}
        {task.description && (
          <DescriptionSections content={task.description} taskIdentifier={task.identifier} />
        )}

        {/* Comments */}
        {task.comments.length > 0 && (
          <div className="glass rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comments ({task.comments.length})
            </h2>
            <div className="space-y-4">
              {task.comments.map((comment) => (
                <div key={comment.id} className="bg-white/5 rounded-xl p-4 md:p-5">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                    {comment.user.avatarUrl ? (
                      <img
                        src={comment.user.avatarUrl}
                        alt={comment.user.name}
                        className="w-8 h-8 rounded-full ring-2 ring-white/10"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-medium">
                        {comment.user.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="font-medium text-sm block">{comment.user.name}</span>
                      <span className="text-xs text-muted">{formatDateTime(comment.createdAt)}</span>
                    </div>
                  </div>
                  <div className="max-w-none">
                    <MarkdownRenderer content={comment.body} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linear Documents */}
        {task.documents.length > 0 && (
          <div className="glass rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documentation ({task.documents.length})
            </h2>
            <div className="grid gap-3">
              {task.documents.map((document) => (
                <Link
                  key={document.id}
                  href={`/sprint/task/${task.identifier}/doc/${document.id}`}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent/10 to-protein/10 rounded-xl hover:from-accent/20 hover:to-protein/20 transition-all border border-accent/20 hover:border-accent/40 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block truncate">{document.title}</span>
                    <span className="text-xs text-muted">View Documentation</span>
                  </div>
                  <svg className="w-4 h-4 text-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments.length > 0 && (
          <div className="glass rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Attachments ({task.attachments.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {task.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 hover:border-accent/30 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block truncate">{attachment.title}</span>
                    <span className="text-xs text-muted">Click to view</span>
                  </div>
                  <svg className="w-4 h-4 text-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-center text-xs text-muted-foreground">
          Created {formatDateTime(task.createdAt)} &middot; Updated {formatDateTime(task.updatedAt)}
        </div>
      </div>
    </div>
  );
}

function PriorityDots({ priority }: { priority: number }) {
  const filled = priority === 0 ? 0 : 5 - priority; // 1=Urgent=4 dots, 4=Low=1 dot
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < filled ? 'bg-current' : 'bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function TaskNavigation({ prevTask, nextTask }: { prevTask: SprintTask | null; nextTask: SprintTask | null }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Previous Task */}
      {prevTask ? (
        <Link
          href={`/sprint/task/${prevTask.id}`}
          className="flex-1 group glass rounded-xl p-4 hover:bg-white/10 transition-all border border-white/5 hover:border-accent/30"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors mt-0.5">
              <svg className="w-4 h-4 text-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted block mb-1">Previous</span>
              <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                {prevTask.title}
              </span>
              <span className="text-xs text-muted font-mono mt-1 block">{prevTask.id}</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Next Task */}
      {nextTask ? (
        <Link
          href={`/sprint/task/${nextTask.id}`}
          className="flex-1 group glass rounded-xl p-4 hover:bg-white/10 transition-all border border-white/5 hover:border-accent/30"
        >
          <div className="flex items-start gap-3 sm:flex-row-reverse sm:text-right">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors mt-0.5">
              <svg className="w-4 h-4 text-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted block mb-1">Next</span>
              <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                {nextTask.title}
              </span>
              <span className="text-xs text-muted font-mono mt-1 block">{nextTask.id}</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}

function ErrorState({ error, taskId }: { error: string; taskId: string }) {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-strong rounded-3xl p-12">
          <div className="text-6xl mb-6">😅</div>
          <h2 className="text-2xl font-bold mb-4">Couldn&apos;t load task {taskId}</h2>
          <p className="text-muted mb-6">
            There was an issue fetching the task details.
          </p>
          <code className="block text-sm text-red-400 bg-white/5 p-4 rounded-xl mb-6 overflow-x-auto">
            {error}
          </code>
          <Link
            href="/sprint"
            className="glass-button inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full"
          >
            Back to Blocks
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
          <h2 className="text-2xl font-bold mb-4">Loading task details...</h2>
          <p className="text-muted">Please wait while we fetch the task information.</p>
        </div>
      </div>
    </section>
  );
}
