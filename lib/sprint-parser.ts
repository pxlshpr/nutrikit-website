import { Octokit } from '@octokit/rest';
import { fetchCompletedTasksForSprint, fetchLiveTaskStatuses, type CompletedTask } from './linear-client';

// Types for sprint data
export interface SprintTask {
  id: string;
  title: string;
  status: 'Backlog' | 'Todo' | 'Queue' | 'Prompt Ready' | 'Running' | 'Testing' | 'Done' | 'Canceled';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low' | 'None';
}

export interface DailyLogEntry {
  day: number;
  date: string;
  dayName: string;
  morningStandup?: string;
  midDayCheckIn?: string;
  eodSummary?: string;
  buildSubmitted?: string;
  completedTasks?: CompletedTask[];
}

export interface SprintInfo {
  number: number;
  label: string;
  character: string;
  theme: string;
  startDate: string;
  endDate: string;
  type: 'A' | 'B';
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNED';
}

export interface SprintData {
  info: SprintInfo;
  goal: string;
  tasks: SprintTask[];
  dailyLog: DailyLogEntry[];
  blockers: string;
  outcome: {
    tasksPlanned: number;
    tasksCompleted: number;
    buildVersion?: string;
    submitted?: boolean;
  };
}

export interface SprintConfig {
  characters: { sprint: number; character: string; universe: 'Zelda' | 'Mario' }[];
}

export interface SprintHistory {
  completedSprints: {
    label: string;
    dateRange: string;
    type: 'A' | 'B';
    goal: string;
    completedTasks: string[];
    incompleteTasks: string[];
    buildVersion?: string;
    submitted: boolean;
  }[];
}

// Parse sprint task status
function parseStatus(status: string): SprintTask['status'] {
  const normalized = status.trim().toLowerCase();
  const statusMap: Record<string, SprintTask['status']> = {
    'backlog': 'Backlog',
    'todo': 'Todo',
    'queue': 'Queue',
    'prompt ready': 'Prompt Ready',
    'running': 'Running',
    'testing': 'Testing',
    'done': 'Done',
    'canceled': 'Canceled',
    'cancelled': 'Canceled',
  };
  return statusMap[normalized] || 'Backlog';
}

// Parse sprint task priority
function parsePriority(priority: string): SprintTask['priority'] {
  const normalized = priority.trim().toLowerCase();
  const priorityMap: Record<string, SprintTask['priority']> = {
    'urgent': 'Urgent',
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low',
    'none': 'None',
  };
  return priorityMap[normalized] || 'Medium';
}

// Extract table rows from markdown
function extractTableRows(content: string, headerPattern: RegExp): string[][] {
  const lines = content.split('\n');
  const rows: string[][] = [];
  let inTable = false;
  let headerFound = false;

  for (const line of lines) {
    if (headerPattern.test(line)) {
      inTable = true;
      headerFound = false;
      continue;
    }

    if (inTable && line.startsWith('|')) {
      // Skip separator line
      if (line.includes('---')) {
        headerFound = true;
        continue;
      }

      if (headerFound) {
        const cells = line
          .split('|')
          .map(cell => cell.trim())
          .filter(cell => cell.length > 0);

        if (cells.length > 0) {
          rows.push(cells);
        }
      }
    } else if (inTable && !line.startsWith('|') && line.trim() !== '') {
      // End of table
      break;
    }
  }

  return rows;
}

// Extract section content between headers
function extractSection(content: string, headerPattern: RegExp, endPattern?: RegExp): string {
  const lines = content.split('\n');
  let capturing = false;
  let result: string[] = [];

  for (const line of lines) {
    if (headerPattern.test(line)) {
      capturing = true;
      continue;
    }

    if (capturing) {
      if (endPattern && endPattern.test(line)) {
        break;
      }
      if (/^##\s/.test(line) && !endPattern) {
        break;
      }
      result.push(line);
    }
  }

  return result.join('\n').trim();
}

// Parse current sprint markdown
export function parseCurrentSprint(content: string): SprintData {
  // Parse Sprint Info table
  const infoRows = extractTableRows(content, /## Sprint Info/);
  const infoMap: Record<string, string> = {};
  for (const row of infoRows) {
    if (row.length >= 2) {
      infoMap[row[0].toLowerCase()] = row[1];
    }
  }

  // Extract character from label (e.g., sprint-1-link -> link)
  const label = infoMap['sprint label']?.replace(/`/g, '') || '';
  const character = label.split('-').pop() || '';

  // Parse status from the blockquote
  const statusMatch = content.match(/>\s*\*\*Status\*\*:\s*(\w+)/);
  const status = (statusMatch?.[1]?.toUpperCase() || 'ACTIVE') as SprintInfo['status'];

  const info: SprintInfo = {
    number: parseInt(infoMap['sprint number'] || '0'),
    label,
    character: character.charAt(0).toUpperCase() + character.slice(1),
    theme: infoMap['theme'] || '',
    startDate: infoMap['start date'] || '',
    endDate: infoMap['end date'] || '',
    type: (infoMap['sprint type']?.charAt(0) || 'A') as 'A' | 'B',
    status,
  };

  // Parse Sprint Goal
  const goalSection = extractSection(content, /## Sprint Goal/);

  // Parse Selected Tasks table
  const taskRows = extractTableRows(content, /## Selected Tasks/);
  const tasks: SprintTask[] = taskRows.map(row => ({
    id: row[0] || '',
    title: row[1] || '',
    status: parseStatus(row[2] || ''),
    priority: parsePriority(row[3] || ''),
  }));

  // Parse Daily Log
  const dailyLog: DailyLogEntry[] = [];
  const dayMatches = content.matchAll(/### Day (\d+) \(([^,]+), ([^)]+)\)\s*\n([\s\S]*?)(?=### Day|\n## |$)/g);

  for (const match of dayMatches) {
    const dayNum = parseInt(match[1]);
    const dayName = match[2];
    const date = match[3];
    const dayContent = match[4];

    const entry: DailyLogEntry = {
      day: dayNum,
      date,
      dayName,
    };

    // Parse log entries
    const morningMatch = dayContent.match(/- \*\*(?:Morning standup|Evening standup)[^*]*\*\*:\s*(.+)/);
    const midDayMatch = dayContent.match(/- \*\*Mid-day check-in[^*]*\*\*:\s*(.+)/);
    const eodMatch = dayContent.match(/- \*\*EOD summary\*\*:\s*(.+)/);
    const buildMatch = dayContent.match(/- \*\*Build submitted\*\*:\s*(.+)/);

    if (morningMatch && morningMatch[1] !== '-') entry.morningStandup = morningMatch[1];
    if (midDayMatch && midDayMatch[1] !== '-') entry.midDayCheckIn = midDayMatch[1];
    if (eodMatch && eodMatch[1] !== '-') entry.eodSummary = eodMatch[1];
    if (buildMatch && buildMatch[1] !== '-') entry.buildSubmitted = buildMatch[1];

    dailyLog.push(entry);
  }

  // Parse Blockers
  const blockers = extractSection(content, /## Blockers & Discoveries/);

  // Parse Sprint Outcome table
  const outcomeRows = extractTableRows(content, /## Sprint Outcome/);
  const outcomeMap: Record<string, string> = {};
  for (const row of outcomeRows) {
    if (row.length >= 2) {
      outcomeMap[row[0].toLowerCase()] = row[1];
    }
  }

  const outcome = {
    tasksPlanned: parseInt(outcomeMap['tasks planned'] || '0'),
    tasksCompleted: parseInt(outcomeMap['tasks completed'] || '0') || 0,
    buildVersion: outcomeMap['build version'] !== '-' ? outcomeMap['build version'] : undefined,
    submitted: outcomeMap['submitted']?.toLowerCase() === 'yes',
  };

  return {
    info,
    goal: goalSection,
    tasks,
    dailyLog,
    blockers,
    outcome,
  };
}

// Parse sprint config
export function parseSprintConfig(content: string): SprintConfig {
  const rows = extractTableRows(content, /### Sprint Labels Pattern/);
  const characters = rows.map(row => ({
    sprint: parseInt(row[0]),
    character: row[1],
    universe: row[2] as 'Zelda' | 'Mario',
  })).filter(c => !isNaN(c.sprint));

  return { characters };
}

// Parse planned sprints markdown
export interface PlannedSprint {
  number: number;
  name: string;
  dateRange: string;
  tasks: SprintTask[];
}

export function parsePlannedSprints(content: string): PlannedSprint[] {
  const sprints: PlannedSprint[] = [];

  // Match sprint headers like "## Sprint 48 - hecate (Tue Jan 7 - Thu Jan 9, 2026)"
  const sprintSections = content.split(/^## Sprint /m).slice(1);

  for (const section of sprintSections) {
    const headerMatch = section.match(/^(\d+)\s*-\s*(\w+)\s*\(([^)]+)\)/);
    if (!headerMatch) continue;

    const sprintNumber = parseInt(headerMatch[1]);
    const sprintName = headerMatch[2];
    const dateRange = headerMatch[3];

    // Extract tasks from table
    const tasks: SprintTask[] = [];
    const tableRows = section.match(/^\|\s*(PXL-\d+)\s*\|\s*([^|]+)\s*\|\s*(\w+)\s*\|/gm);

    if (tableRows) {
      for (const row of tableRows) {
        const rowMatch = row.match(/^\|\s*(PXL-\d+)\s*\|\s*([^|]+)\s*\|\s*(\w+)\s*\|/);
        if (rowMatch) {
          tasks.push({
            id: rowMatch[1].trim(),
            title: rowMatch[2].trim(),
            status: 'Prompt Ready' as SprintTask['status'], // Default for planned tasks
            priority: parsePriority(rowMatch[3].trim()),
          });
        }
      }
    }

    sprints.push({
      number: sprintNumber,
      name: sprintName,
      dateRange,
      tasks,
    });
  }

  return sprints;
}

// Fetch sprint data from GitHub
export async function fetchSprintData(): Promise<{
  current: SprintData;
  config: SprintConfig;
  plannedSprints: PlannedSprint[];
}> {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const owner = 'pxlshpr';
  const repo = 'NutriKit';
  const branch = 'main';

  async function fetchFile(path: string): Promise<string> {
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });

      if ('content' in response.data && response.data.content) {
        return Buffer.from(response.data.content, 'base64').toString('utf-8');
      }
      throw new Error('No content in response');
    } catch (error) {
      console.error(`Failed to fetch ${path}:`, error);
      throw error;
    }
  }

  const [currentContent, configContent, plannedContent] = await Promise.all([
    fetchFile('.claude/sprints/current-sprint.md'),
    fetchFile('.claude/sprints/config.md'),
    fetchFile('.claude/sprints/planned-sprints.md').catch(() => ''), // Optional file
  ]);

  const currentSprint = parseCurrentSprint(currentContent);

  // Fetch LIVE task statuses from Linear (overrides markdown statuses)
  try {
    const taskIds = currentSprint.tasks.map(t => t.id);
    const liveStatuses = await fetchLiveTaskStatuses(taskIds);

    // Update tasks with live statuses from Linear
    currentSprint.tasks = currentSprint.tasks.map(task => {
      const liveStatus = liveStatuses.get(task.id);
      if (liveStatus) {
        return {
          ...task,
          status: parseStatus(liveStatus.status),
        };
      }
      return task;
    });
  } catch (error) {
    console.error('Failed to fetch live task statuses from Linear:', error);
  }

  // Fetch completed tasks from Linear for this sprint
  let completedTasks: CompletedTask[] = [];
  try {
    completedTasks = await fetchCompletedTasksForSprint(currentSprint.info.label);
  } catch (error) {
    console.error('Failed to fetch completed tasks from Linear:', error);
  }

  // Group completed tasks by day
  const tasksByDay = groupTasksByDay(completedTasks, currentSprint.info.startDate);

  // Add completed tasks to each day in the daily log
  currentSprint.dailyLog = currentSprint.dailyLog.map(entry => ({
    ...entry,
    completedTasks: tasksByDay[entry.day] || [],
  }));

  return {
    current: currentSprint,
    config: parseSprintConfig(configContent),
    plannedSprints: plannedContent ? parsePlannedSprints(plannedContent) : [],
  };
}

// Group tasks by the day they were completed (relative to sprint start)
function groupTasksByDay(tasks: CompletedTask[], sprintStartDate: string): Record<number, CompletedTask[]> {
  const grouped: Record<number, CompletedTask[]> = {};

  // Parse sprint start date (format: "Sat, Jan 4, 2026")
  const startDate = new Date(sprintStartDate + ', 2026');
  startDate.setHours(0, 0, 0, 0);

  for (const task of tasks) {
    const completedDate = new Date(task.completedAt);
    completedDate.setHours(0, 0, 0, 0);

    // Calculate day number (1-based)
    const daysDiff = Math.floor((completedDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayNumber = daysDiff + 1;

    // Only include tasks completed during the sprint (days 1-3)
    if (dayNumber >= 1 && dayNumber <= 3) {
      if (!grouped[dayNumber]) {
        grouped[dayNumber] = [];
      }
      grouped[dayNumber].push(task);
    }
  }

  // Sort tasks within each day by completion time
  for (const day in grouped) {
    grouped[day].sort((a, b) =>
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
  }

  return grouped;
}

// Calculate sprint progress
export function calculateProgress(tasks: SprintTask[]): number {
  if (tasks.length === 0) return 0;

  const completedCount = tasks.filter(t =>
    t.status === 'Done' || t.status === 'Testing'
  ).length;

  return Math.round((completedCount / tasks.length) * 100);
}

// Get status color class
export function getStatusColor(status: SprintTask['status']): string {
  const colors: Record<SprintTask['status'], string> = {
    'Backlog': 'bg-muted-foreground/30 text-muted',
    'Todo': 'bg-white/10 text-foreground',
    'Queue': 'bg-white/15 text-foreground',
    'Prompt Ready': 'bg-accent/20 text-accent-light border-accent/30',
    'Running': 'bg-protein/20 text-protein-light border-protein/30',
    'Testing': 'bg-carbs/20 text-carbs-light border-carbs/30',
    'Done': 'bg-success/20 text-success-light border-success/30',
    'Canceled': 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[status] || colors['Backlog'];
}

// Get priority color class
export function getPriorityColor(priority: SprintTask['priority']): string {
  const colors: Record<SprintTask['priority'], string> = {
    'Urgent': 'text-red-400',
    'High': 'text-orange-400',
    'Medium': 'text-carbs',
    'Low': 'text-muted',
    'None': 'text-muted-foreground',
  };
  return colors[priority] || colors['Medium'];
}

// Generate sprint name from Greek gods/titans
// Using sprint number to cycle through the list
export function getSprintName(sprintNumber: number): string {
  const greekGods = [
    'zeus', 'hera', 'poseidon', 'demeter', 'athena',
    'apollo', 'artemis', 'ares', 'aphrodite', 'hephaestus',
    'hermes', 'hestia', 'dionysus', 'hades', 'persephone',
    'eros', 'pan', 'nike', 'iris', 'morpheus',
    'helios', 'selene', 'eos', 'atlas', 'prometheus',
    'cronus', 'rhea', 'hyperion', 'theia', 'oceanus',
    'tethys', 'mnemosyne', 'themis', 'phoebe', 'coeus',
    'crius', 'iapetus', 'dione', 'metis', 'styx',
    'triton', 'proteus', 'nereus', 'amphitrite', 'galatea',
    'calypso', 'circe', 'hecate', 'nemesis', 'tyche',
  ];

  const index = (sprintNumber - 1) % greekGods.length;
  return greekGods[index];
}

// Format date for display
export function formatDate(dateStr: string): string {
  // Handle formats like "Sat, Jan 4, 2026"
  const parts = dateStr.split(', ');
  if (parts.length >= 2) {
    return parts.slice(1).join(', ');
  }
  return dateStr;
}
