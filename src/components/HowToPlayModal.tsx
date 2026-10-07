import { motion, AnimatePresence } from 'framer-motion';
import { X, Flower, Keyboard, Trophy, ChartBar, Moon, GraduationCap, PottedPlant, Sparkle } from '@phosphor-icons/react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToPlayModal({
  isOpen,
  onClose,
}: HowToPlayModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-surface rounded-xl shadow-xl w-[95%] sm:w-[90%] md:w-[85%] lg:w-[900px] min-w-[280px] mx-4 p-4 sm:p-6 border border-ink/15 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-ink">
                How to Play
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-muted hover:text-ink transition-colors rounded-full hover:bg-ink/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">

              {/* Section 1: The Basics */}
              <div className="space-y-3">
                <h3 className="text-base font-display font-semibold text-ink flex items-center gap-2">
                  <Flower size={18} weight="duotone" className="text-petal-found" />
                  The Basics
                </h3>
                <div className="bg-bg rounded-lg p-3 sm:p-4 border border-ink/15">
                  <p className="text-muted text-sm mb-3">
                    Create words using the letters in the grid. Every word must:
                  </p>
                  <ul className="space-y-1.5 text-muted text-sm ml-3">
                    <li className="flex items-start gap-2">
                      <span className="text-leaf mt-0.5">•</span>
                      <span>Include the <strong className="text-gold">center letter</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-leaf mt-0.5">•</span>
                      <span>Be at least <strong className="text-ink">4 letters</strong> long</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-leaf mt-0.5">•</span>
                      <span>Use only the <strong className="text-ink">7 provided letters</strong> (repeats allowed)</span>
                    </li>
                  </ul>

                  {/* Example tiles */}
                  <div className="mt-4 flex justify-center">
                    <div className="flex gap-1 sm:gap-1.5">
                      {/* Center letter - gold */}
                      <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md bg-gold text-gold-ink font-display font-bold text-xs sm:text-sm shrink-0">
                        G
                      </div>
                      {/* Outer letters - petals */}
                      {['A','R','D','E','N','S'].map(letter => (
                        <div key={letter} className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md bg-petal-found text-petal-ink font-display font-bold text-xs sm:text-sm shrink-0">
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-xs text-muted mt-2">
                    The center letter (gold) must appear in every word
                  </p>
                </div>
              </div>

              {/* Section 2: Controls */}
              <div className="space-y-3">
                <h3 className="text-base font-display font-semibold text-ink flex items-center gap-2">
                  <Keyboard size={18} weight="duotone" className="text-leaf" />
                  Controls
                </h3>
                <div className="bg-bg rounded-lg p-3 sm:p-4 border border-ink/15">
                  <div className="space-y-1.5 text-muted text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-leaf mt-0.5">•</span>
                      <span>Type on your keyboard <em>or</em> tap letters in the grid to build a word</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-leaf mt-0.5">•</span>
                      <span><strong className="text-ink">Enter</strong> to submit · <strong className="text-ink">Delete</strong> to remove last letter</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-leaf mt-0.5">•</span>
                      <span><strong className="text-ink">Shuffle</strong> to rearrange the outer letters for a fresh perspective</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-leaf mt-0.5">•</span>
                      <span><strong className="text-ink">Sort</strong> found words by newest, alphabetically, or by length</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Scoring */}
              <div className="space-y-3">
                <h3 className="text-base font-display font-semibold text-ink flex items-center gap-2">
                  <Trophy size={18} weight="duotone" className="text-gold" />
                  Scoring
                </h3>
                <div className="bg-bg rounded-lg p-3 sm:p-4 border border-ink/15 space-y-3">
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-surface rounded">
                      <span className="text-muted">4-letter words</span>
                      <span className="text-ink font-bold">1 point</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-surface rounded">
                      <span className="text-muted">5+ letter words</span>
                      <span className="text-ink font-bold">1 point per letter</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-rose/15 rounded border border-rose/40">
                      <span className="text-ink">Pangram — uses all 7 letters</span>
                      <span className="text-rose font-bold">+10 bonus</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gold/15 rounded border border-gold/40">
                      <span className="text-ink">Bingo — a word starting with each letter</span>
                      <span className="text-gold font-bold">+10 bonus</span>
                    </div>
                  </div>

                  <div className="p-3 bg-surface rounded text-sm">
                    <p className="text-muted mb-1.5"><strong className="text-ink">Examples:</strong></p>
                    <div className="space-y-1 text-muted">
                      <div>AGES (4 letters) = 1 pt</div>
                      <div>GRADE (5 letters) = 5 pts</div>
                      <div>GARDENS (7 letters, pangram) = 7 + 10 = 17 pts</div>
                    </div>
                  </div>

                  <div className="p-3 bg-gold/10 rounded text-sm border border-gold/30">
                    <p className="text-ink flex items-start gap-1.5">
                      <PottedPlant size={16} weight="duotone" className="text-gold shrink-0 mt-0.5" />
                      <span>
                        If this icon appears in the top-left, today&apos;s puzzle has a bingo available. Letter tiles start dim and brighten as you cover each starting letter.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4: Progress & Found Words */}
              <div className="space-y-3">
                <h3 className="text-base font-display font-semibold text-ink flex items-center gap-2">
                  <ChartBar size={18} weight="duotone" className="text-leaf" />
                  Progress & Found Words
                </h3>
                <div className="bg-bg rounded-lg p-3 sm:p-4 border border-ink/15 space-y-3">
                  <div className="space-y-1.5 text-muted text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-leaf mt-0.5">•</span>
                      <span>
                        The <strong className="text-ink">progress bar</strong> shows your current level —
                        from <span className="text-ink inline-flex items-center gap-1"><Moon size={14} weight="duotone" className="text-leaf" /> Dormant</span> all the way to <span className="text-ink inline-flex items-center gap-1"><GraduationCap size={14} weight="duotone" className="text-leaf" /> Botanist</span>
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkle size={14} weight="duotone" className="text-gold mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-gold">Tap the progress bar</strong> to see the full level progression and your position within it
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-leaf mt-0.5">•</span>
                      <span>Found words are color-coded by length: <span className="text-bloom4">moss</span>=4, <span className="text-bloom5">coral</span>=5, <span className="text-bloom6">lilac</span>=6, <span className="text-bloom7">marigold</span>=7, <span className="text-bloom8">rose</span>=8+</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-leaf mt-0.5">•</span>
                      <span><span className="text-gold">Gold-to-rose</span> words are pangrams — worth the +10 bonus</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-leaf mt-0.5">•</span>
                      <span>Tap any found word to view its definition</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Button */}
            <div className="mt-5 pt-4 border-t border-ink/15">
              <button
                onClick={onClose}
                className="w-full bg-gold hover:bg-gold/90 text-gold-ink font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
