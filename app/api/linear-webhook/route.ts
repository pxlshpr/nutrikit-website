import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  syncIssueUpdate,
  verifyWebhookSignature,
  type LinearWebhookPayload,
} from '@/lib/linear-webhook-sync';

// Handle Linear webhook POST requests
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('linear-signature');
    const webhookSecret = process.env.LINEAR_WEBHOOK_SECRET;

    // Log incoming webhook with details for debugging
    console.log('[Linear Webhook] Received webhook');
    console.log('[Linear Webhook] Headers:', JSON.stringify(Object.fromEntries(request.headers.entries())));
    console.log('[Linear Webhook] Signature header:', signature);
    console.log('[Linear Webhook] Body length:', rawBody.length);

    // Verify signature if secret is configured
    // TEMPORARILY DISABLED FOR DEBUGGING - remove this bypass after testing
    const bypassSignature = true; // TODO: Set to false after testing
    if (webhookSecret && !bypassSignature) {
      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error('[Linear Webhook] Invalid signature');
        console.error('[Linear Webhook] Received sig:', signature);
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    } else {
      console.warn('[Linear Webhook] Signature verification bypassed for testing');
    }

    // Parse payload
    const payload: LinearWebhookPayload = JSON.parse(rawBody);

    console.log(`[Linear Webhook] Type: ${payload.type}, Action: ${payload.action}`);
    console.log(`[Linear Webhook] Data:`, JSON.stringify(payload.data, null, 2));

    // Only process Issue webhooks
    if (payload.type !== 'Issue') {
      return NextResponse.json({
        success: true,
        message: `Ignoring ${payload.type} webhook`,
      });
    }

    // Sync the issue update to local files and GitHub
    const result = await syncIssueUpdate(payload);

    // Trigger on-demand revalidation for sprint pages
    if (result.changes.length > 0) {
      try {
        revalidatePath('/sprint');
        revalidatePath('/sprint/task/[id]', 'page');
        console.log('[Linear Webhook] Triggered revalidation for sprint pages');
      } catch (revalidateError) {
        console.error('[Linear Webhook] Revalidation error:', revalidateError);
      }
    }

    return NextResponse.json({
      success: result.success,
      message: result.message,
      changes: result.changes,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Linear Webhook] Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle webhook verification (GET request from Linear)
export async function GET() {
  return NextResponse.json({
    status: 'Linear webhook endpoint active',
    timestamp: new Date().toISOString(),
  });
}
