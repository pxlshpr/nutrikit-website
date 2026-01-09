'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import TaskTerminal from '@/components/sprint/TaskTerminal';

interface TerminalSectionProps {
  taskIdentifier: string;
  taskTitle: string;
}

export default function TerminalSection({ taskIdentifier, taskTitle }: TerminalSectionProps) {
  const { data: session, status } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn("apple", { callbackUrl: window.location.href });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsSigningIn(false);
    }
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="glass rounded-2xl overflow-hidden mb-6 border border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                Claude Terminal
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse" />
              </h3>
              <p className="text-xs text-muted">
                Loading...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated and allowed, show the full TaskTerminal
  if (session?.user?.isAllowed) {
    return <TaskTerminal taskIdentifier={taskIdentifier} taskTitle={taskTitle} />;
  }

  // Not authenticated - show sign in prompt
  if (!session) {
    return (
      <div className="glass rounded-2xl overflow-hidden mb-6 border border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                Claude Terminal
                <span className="w-2 h-2 rounded-full bg-zinc-500" />
              </h3>
              <p className="text-xs text-muted">
                Sign in to access terminal
              </p>
            </div>
          </div>
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
          >
            {isSigningIn ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Sign in with Apple
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Authenticated but not allowed - show access denied
  return (
    <div className="glass rounded-2xl overflow-hidden mb-6 border border-white/10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 text-red-400">
              Access Denied
            </h3>
            <p className="text-xs text-muted">
              Your Apple ID is not authorized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
