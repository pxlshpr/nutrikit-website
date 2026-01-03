import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchTaskDetails, getStatusColorClass, getPriorityColorClass } from '@/lib/linear-client';

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

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;

  let task;
  let error = null;

  try {
    task = await fetchTaskDetails(id);
    if (!task) {
      notFound();
    }
  } catch (e) {
    console.error('Failed to fetch task:', e);
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
              <Link href="/sprint" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
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
          <ErrorState error={error} taskId={id} />
        ) : task ? (
          <TaskDetailContent task={task} />
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

function TaskDetailContent({ task }: { task: NonNullable<Awaited<ReturnType<typeof fetchTaskDetails>>> }) {
  const statusColor = getStatusColorClass(task.status);
  const priorityColor = getPriorityColorClass(task.priority);

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
          Back to Sprint
        </Link>

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
            {task.project && (
              <div>
                <span className="text-muted block mb-1">Project</span>
                <span className="font-medium">{task.project.name}</span>
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
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-muted text-sm block mb-2">Labels</span>
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label) => (
                  <span
                    key={label}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External link */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View in Linear
            </a>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <div className="prose prose-invert prose-sm max-w-none">
              <MarkdownContent content={task.description} />
            </div>
          </div>
        )}

        {/* Git branch */}
        {task.branchName && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3">Git Branch</h2>
            <code className="block bg-white/5 px-4 py-3 rounded-xl text-sm font-mono text-protein overflow-x-auto">
              {task.branchName}
            </code>
          </div>
        )}

        {/* Comments */}
        {task.comments.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Comments ({task.comments.length})
            </h2>
            <div className="space-y-4">
              {task.comments.map((comment) => (
                <div key={comment.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {comment.user.avatarUrl && (
                      <img
                        src={comment.user.avatarUrl}
                        alt={comment.user.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    <span className="text-xs text-muted">{formatDateTime(comment.createdAt)}</span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <MarkdownContent content={comment.body} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Attachments ({task.attachments.length})
            </h2>
            <div className="space-y-2">
              {task.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-sm">{attachment.title}</span>
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

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown rendering - convert basic formatting
  // For full markdown support, consider adding react-markdown
  const lines = content.split('\n');

  return (
    <div className="whitespace-pre-wrap text-foreground/90">
      {lines.map((line, i) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-base font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-lg font-semibold mt-4 mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
        }

        // List items
        if (line.startsWith('- [ ] ')) {
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <input type="checkbox" disabled className="mt-1" />
              <span>{line.slice(6)}</span>
            </div>
          );
        }
        if (line.startsWith('- [x] ')) {
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <input type="checkbox" checked disabled className="mt-1" />
              <span className="line-through text-muted">{line.slice(6)}</span>
            </div>
          );
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <span className="text-muted">&bull;</span>
              <span>{line.slice(2)}</span>
            </div>
          );
        }

        // Code blocks (simple)
        if (line.startsWith('```')) {
          return null; // Skip code fence markers
        }

        // Regular paragraph
        if (line.trim()) {
          return <p key={i} className="my-2">{line}</p>;
        }

        // Empty line
        return <br key={i} />;
      })}
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
            Back to Sprint
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
