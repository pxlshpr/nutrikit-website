"use client";

import { useState, useEffect } from "react";

type BackgroundType = "none" | "particles" | "lava" | "crt" | "glow" | "aurora" | "mesh";

interface VoteData {
  userChoice: BackgroundType | null;
  counts: Record<BackgroundType, number>;
  total: number;
}

const options: { value: BackgroundType; label: string; desc: string }[] = [
  { value: "none", label: "None", desc: "Solid background only" },
  { value: "particles", label: "Particles", desc: "Floating dots" },
  { value: "lava", label: "Lava Lamp", desc: "Gooey metaballs" },
  { value: "crt", label: "CRT", desc: "Retro scanlines" },
  { value: "glow", label: "Glow", desc: "Spinning conic" },
  { value: "aurora", label: "Aurora", desc: "Floating orbs" },
  { value: "mesh", label: "Mesh", desc: "Original gradient" },
];

interface BackgroundPollProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackgroundPoll({ isOpen, onClose }: BackgroundPollProps) {
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchVotes();
    }
  }, [isOpen]);

  async function fetchVotes() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/vote");
      const data = await res.json();
      setVoteData(data);
      setHasVoted(!!data.userChoice);
    } catch (error) {
      console.error("Failed to fetch votes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function submitVote(choice: BackgroundType) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      });
      const data = await res.json();
      if (data.success) {
        setVoteData(data);
        setHasVoted(true);
      }
    } catch (error) {
      console.error("Failed to submit vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const maxVotes = voteData ? Math.max(...Object.values(voteData.counts), 1) : 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md glass rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold gradient-text-accent">
              Vote for Your Favorite Background
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-muted mt-1">
            {hasVoted ? "Thanks for voting! Here are the results." : "Click on your favorite to cast your vote."}
            {voteData?.userChoice && (
              <span className="block mt-1 text-accent">
                You can change your vote anytime.
              </span>
            )}
          </p>
        </div>

        {/* Options */}
        <div className="px-6 pb-6 space-y-2">
          {isLoading ? (
            <div className="py-8 text-center text-muted">
              <div className="inline-block w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <p className="mt-2 text-sm">Loading poll...</p>
            </div>
          ) : (
            options.map((option) => {
              const votes = voteData?.counts[option.value] || 0;
              const percentage = voteData?.total ? (votes / voteData.total) * 100 : 0;
              const isUserChoice = voteData?.userChoice === option.value;
              const barWidth = voteData?.total ? (votes / maxVotes) * 100 : 0;

              return (
                <button
                  key={option.value}
                  onClick={() => submitVote(option.value)}
                  disabled={isSubmitting}
                  className={`w-full relative overflow-hidden rounded-xl transition-all ${
                    isUserChoice
                      ? "ring-2 ring-accent bg-accent/10"
                      : "hover:bg-white/5"
                  } ${isSubmitting ? "opacity-50 cursor-wait" : ""}`}
                >
                  {/* Progress bar background */}
                  <div
                    className="absolute inset-y-0 left-0 bg-accent/20 transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />

                  {/* Content */}
                  <div className="relative px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isUserChoice && (
                        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted">{option.desc}</div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="font-bold text-accent">{votes}</div>
                      <div className="text-xs text-muted">
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        {voteData && (
          <div className="px-6 py-4 border-t border-white/10 text-center text-sm text-muted">
            {voteData.total} {voteData.total === 1 ? "vote" : "votes"} total
          </div>
        )}
      </div>
    </div>
  );
}
