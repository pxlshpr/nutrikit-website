import { LinearClient } from '@linear/sdk';

// Types for task details
export interface TaskComment {
  id: string;
  body: string;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
}

export interface TaskDetails {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  status: string;
  priority: number;
  priorityLabel: string;
  estimate?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  branchName?: string;
  labels: string[];
  assignee?: {
    name: string;
    avatarUrl?: string;
  };
  creator?: {
    name: string;
  };
  project?: {
    name: string;
    icon?: string;
  };
  comments: TaskComment[];
  attachments: {
    id: string;
    title: string;
    url: string;
  }[];
}

// Create Linear client
function getLinearClient(): LinearClient {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }
  return new LinearClient({ apiKey });
}

// Fetch task details by identifier (e.g., "PXL-833")
export async function fetchTaskDetails(identifier: string): Promise<TaskDetails | null> {
  try {
    const client = getLinearClient();

    // Search for the issue by identifier
    const issues = await client.issues({
      filter: {
        number: { eq: parseInt(identifier.split('-')[1]) },
        team: { key: { eq: identifier.split('-')[0] } },
      },
      first: 1,
    });

    const issue = issues.nodes[0];
    if (!issue) {
      return null;
    }

    // Fetch related data
    const [state, assignee, creator, project, labels, comments, attachments] = await Promise.all([
      issue.state,
      issue.assignee,
      issue.creator,
      issue.project,
      issue.labels(),
      issue.comments(),
      issue.attachments(),
    ]);

    // Map priority number to label
    const priorityLabels: Record<number, string> = {
      0: 'No priority',
      1: 'Urgent',
      2: 'High',
      3: 'Medium',
      4: 'Low',
    };

    // Process comments
    const processedComments: TaskComment[] = [];
    for (const comment of comments.nodes) {
      const user = await comment.user;
      processedComments.push({
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt.toISOString(),
        user: {
          name: user?.name || 'Unknown',
          avatarUrl: user?.avatarUrl || undefined,
        },
      });
    }

    return {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      description: issue.description || undefined,
      status: (await state)?.name || 'Unknown',
      priority: issue.priority,
      priorityLabel: priorityLabels[issue.priority] || 'Medium',
      estimate: issue.estimate || undefined,
      dueDate: issue.dueDate || undefined,
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      url: issue.url,
      branchName: issue.branchName || undefined,
      labels: labels.nodes.map(l => l.name),
      assignee: assignee
        ? {
            name: assignee.name,
            avatarUrl: assignee.avatarUrl || undefined,
          }
        : undefined,
      creator: creator
        ? {
            name: creator.name,
          }
        : undefined,
      project: project
        ? {
            name: project.name,
            icon: project.icon || undefined,
          }
        : undefined,
      comments: processedComments,
      attachments: attachments.nodes.map(a => ({
        id: a.id,
        title: a.title,
        url: a.url,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch task details:', error);
    throw error;
  }
}

// Get status color class
export function getStatusColorClass(status: string): string {
  const colors: Record<string, string> = {
    'Backlog': 'bg-muted-foreground/30 text-muted',
    'Todo': 'bg-white/10 text-foreground',
    'Queue': 'bg-white/15 text-foreground',
    'Prompt Ready': 'bg-accent/20 text-accent-light border-accent/30',
    'Running': 'bg-protein/20 text-protein-light border-protein/30',
    'Testing': 'bg-carbs/20 text-carbs-light border-carbs/30',
    'Done': 'bg-success/20 text-success-light border-success/30',
    'Canceled': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[status] || colors['Backlog'];
}

// Get priority color class
export function getPriorityColorClass(priority: number): string {
  const colors: Record<number, string> = {
    1: 'text-red-400',
    2: 'text-orange-400',
    3: 'text-carbs',
    4: 'text-muted',
    0: 'text-muted-foreground',
  };
  return colors[priority] || colors[3];
}
