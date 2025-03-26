'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuProps {
  onShowYesterdaysPuzzle: () => void;
  timeToNextPuzzle: string;
}

export default function Menu({ onShowYesterdaysPuzzle, timeToNextPuzzle }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors mr-2 flex items-center"
        aria-label="Menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full mt-2 w-56 rounded-lg bg-[#1C1C1E] shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-[#2D5A27]"
            >
              <div className="p-2 space-y-1">
                {/* Next Puzzle Countdown */}
                <div className="px-3 py-2 text-sm">
                  <div className="text-gray-400">Next puzzle in:</div>
                  <div className="text-white font-medium">{timeToNextPuzzle}</div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-700" />

                {/* Yesterday's Puzzle Option */}
                <button
                  onClick={() => {
                    onShowYesterdaysPuzzle();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  <span className="text-lg">📅</span>
                  Yesterday's Puzzle
                </button>

                {/* Divider */}
                <div className="h-px bg-gray-700" />

                {/* Authentication Section */}
                <div className="px-3 py-2">
                  {user ? (
                    <>
                      <div className="text-sm text-gray-300 mb-2">
                        Signed in as:
                        <div className="font-medium text-white">{user.displayName}</div>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                        className="w-full px-3 py-2 text-sm text-white bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        signInWithGoogle();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 