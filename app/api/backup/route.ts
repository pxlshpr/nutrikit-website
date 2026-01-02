import { createClient } from '@supabase/supabase-js'
import { Octokit } from '@octokit/rest'
import { NextResponse } from 'next/server'

const TABLES = ['users', 'foods', 'preferences', 'days', 'meals', 'meal_items', 'user_foods', 'meal_presets']

// Exclude sensitive fields from backup
const EXCLUDED_FIELDS: Record<string, string[]> = {
  users: ['apple_user_id', 'cloudkit_id', 'device_ids']
}

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })

    const timestamp = new Date().toISOString().split('T')[0]
    const backup: Record<string, unknown[]> = {}

    // Fetch all tables with pagination (Supabase limits to 1000 per request)
    for (const table of TABLES) {
      const allRows: unknown[] = []
      let offset = 0
      const limit = 1000

      while (true) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .range(offset, offset + limit - 1)

        if (error) {
          console.error(`Error fetching ${table}:`, error)
          break
        }

        if (!data || data.length === 0) break

        // Filter out excluded fields
        if (EXCLUDED_FIELDS[table]) {
          for (const row of data) {
            const filtered = { ...row }
            for (const field of EXCLUDED_FIELDS[table]) {
              delete filtered[field]
            }
            allRows.push(filtered)
          }
        } else {
          allRows.push(...data)
        }

        if (data.length < limit) break
        offset += limit
      }

      backup[table] = allRows
    }

    // Create backup content
    const content = JSON.stringify(backup, null, 2)
    const encodedContent = Buffer.from(content).toString('base64')

    // Commit to GitHub backup repo
    const owner = process.env.GITHUB_OWNER!
    const repo = process.env.GITHUB_BACKUP_REPO!
    const path = `backups/${timestamp}.json`

    // Check if file exists (for updates)
    let sha: string | undefined
    try {
      const { data: existingFile } = await octokit.repos.getContent({
        owner,
        repo,
        path
      })
      if ('sha' in existingFile) {
        sha = existingFile.sha
      }
    } catch {
      // File doesn't exist, that's fine
    }

    // Create or update the backup file
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Backup ${timestamp}`,
      content: encodedContent,
      sha
    })

    // Also commit to CloudKit public repo if configured
    if (process.env.GITHUB_CLOUDKIT_REPO) {
      const cloudkitRepo = process.env.GITHUB_CLOUDKIT_REPO
      const cloudkitPath = `supabase-backups/${timestamp}.json`

      let cloudkitSha: string | undefined
      try {
        const { data: existingFile } = await octokit.repos.getContent({
          owner,
          repo: cloudkitRepo,
          path: cloudkitPath
        })
        if ('sha' in existingFile) {
          cloudkitSha = existingFile.sha
        }
      } catch {
        // File doesn't exist
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo: cloudkitRepo,
        path: cloudkitPath,
        message: `Supabase backup ${timestamp}`,
        content: encodedContent,
        sha: cloudkitSha
      })
    }

    // Cleanup old backups (keep last 30 daily, then weekly, then monthly)
    await cleanupOldBackups(octokit, owner, repo)

    return NextResponse.json({
      success: true,
      timestamp,
      tables: Object.keys(backup).map(t => ({ table: t, rows: backup[t].length }))
    })

  } catch (error) {
    console.error('Backup error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      error: 'Backup failed',
      details: errorMessage,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasGithubToken: !!process.env.GITHUB_TOKEN,
      hasGithubOwner: !!process.env.GITHUB_OWNER,
      hasGithubRepo: !!process.env.GITHUB_BACKUP_REPO
    }, { status: 500 })
  }
}

async function cleanupOldBackups(octokit: Octokit, owner: string, repo: string) {
  try {
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'backups'
    })

    if (!Array.isArray(contents)) return

    const files = contents
      .filter(f => f.name.endsWith('.json'))
      .map(f => ({
        name: f.name,
        date: f.name.replace('.json', ''),
        sha: f.sha
      }))
      .sort((a, b) => b.date.localeCompare(a.date))

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    const toKeep = new Set<string>()
    const weeklyKept = new Set<string>()
    const monthlyKept = new Set<string>()

    for (const file of files) {
      const fileDate = new Date(file.date)

      // Keep all from last 30 days
      if (fileDate >= thirtyDaysAgo) {
        toKeep.add(file.name)
        continue
      }

      // Keep one per week for 30-90 days
      if (fileDate >= ninetyDaysAgo) {
        const weekKey = getWeekKey(fileDate)
        if (!weeklyKept.has(weekKey)) {
          weeklyKept.add(weekKey)
          toKeep.add(file.name)
        }
        continue
      }

      // Keep one per month for older
      const monthKey = `${fileDate.getFullYear()}-${fileDate.getMonth()}`
      if (!monthlyKept.has(monthKey)) {
        monthlyKept.add(monthKey)
        toKeep.add(file.name)
      }
    }

    // Delete files not in toKeep
    for (const file of files) {
      if (!toKeep.has(file.name)) {
        await octokit.repos.deleteFile({
          owner,
          repo,
          path: `backups/${file.name}`,
          message: `Cleanup old backup ${file.name}`,
          sha: file.sha
        })
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error)
  }
}

function getWeekKey(date: Date): string {
  const year = date.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7)
  return `${year}-W${week}`
}
