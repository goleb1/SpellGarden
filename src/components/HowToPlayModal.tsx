import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

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
            className="relative bg-[#1C1C1E] rounded-xl shadow-xl w-[95%] sm:w-[90%] md:w-[85%] lg:w-[900px] min-w-[280px] mx-4 p-4 sm:p-6 border border-[#2D5A27] overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                How to Play
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">

              {/* Section 1: The Basics */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  🌸 The Basics
                </h3>
                <div className="bg-[#142911] rounded-lg p-3 sm:p-4 border border-[#2D5A27]">
                  <p className="text-gray-300 text-sm mb-3">
                    Create words using the letters in the grid. Every word must:
                  </p>
                  <ul className="space-y-1.5 text-gray-300 text-sm ml-3">
                    <li className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-0.5">•</span>
                      <span>Include the <strong className="text-amber-300">center letter</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-0.5">•</span>
                      <span>Be at least <strong className="text-white">4 letters</strong> long</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-0.5">•</span>
                      <span>Use only the <strong className="text-white">7 provided letters</strong> (repeats allowed)</span>
                    </li>
                  </ul>

                  {/* Example tiles */}
                  <div className="mt-4 flex justify-center">
                    <div className="flex gap-1 sm:gap-1.5">
                      {/* Center letter - amber/yellow */}
                      <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md bg-amber-300 text-black font-bold text-xs sm:text-sm shrink-0">
                        G
                      </div>
                      {/* Outer letters - purple */}
                      {['A','R','D','E','N','S'].map(letter => (
                        <div key={letter} className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md bg-purple-400 text-black font-bold text-xs sm:text-sm shrink-0">
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    The center letter (yellow) must appear in every word
                  </p>
                </div>
              </div>

              {/* Section 2: Controls */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  ⌨️ Controls
                </h3>
                <div className="bg-[#142911] rounded-lg p-3 sm:p-4 border border-[#2D5A27]">
                  <div className="space-y-1.5 text-gray-300 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-0.5">•</span>
                      <span>Type on your keyboard <em>or</em> tap letters in the grid to build a word</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-0.5">•</span>
                      <span><strong className="text-white">Enter</strong> to submit · <strong className="text-white">Delete</strong> to remove last letter</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-0.5">•</span>
                      <span><strong className="text-white">Shuffle</strong> to rearrange the outer letters for a fresh perspective</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-0.5">•</span>
                      <span><strong className="text-white">Sort</strong> found words by time (⏪), alphabet (🔤), or length (📶)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Scoring */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  🏆 Scoring
                </h3>
                <div className="bg-[#142911] rounded-lg p-3 sm:p-4 border border-[#2D5A27] space-y-3">
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-[#1C1C1E] rounded">
                      <span className="text-gray-300">4-letter words</span>
                      <span className="text-white font-bold">1 point</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#1C1C1E] rounded">
                      <span className="text-gray-300">5+ letter words</span>
                      <span className="text-white font-bold">1 point per letter</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#2D5A27] rounded border border-green-600">
                      <span className="text-white">Pangram — uses all 7 letters</span>
                      <span className="text-[#4ADE80] font-bold">+10 bonus</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#2D5A27] rounded border border-yellow-600">
                      <span className="text-white">Bingo — a word starting with each letter</span>
                      <span className="text-[#fbbf24] font-bold">+10 bonus</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#1C1C1E] rounded text-sm">
                    <p className="text-gray-300 mb-1.5"><strong className="text-white">Examples:</strong></p>
                    <div className="space-y-1 text-gray-300">
                      <div>AGES (4 letters) = 1 pt</div>
                      <div>GRADE (5 letters) = 5 pts</div>
                      <div>GARDENS (7 letters, pangram) = 7 + 10 = 17 pts</div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-900/20 rounded text-sm border border-yellow-600/30">
                    <p className="text-yellow-200">
                      If the <strong>🪴</strong> icon appears in the top-left, today&apos;s puzzle has a bingo available. Letter tiles start dim and brighten as you cover each starting letter.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4: Progress & Found Words */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  📊 Progress & Found Words
                </h3>
                <div className="bg-[#142911] rounded-lg p-3 sm:p-4 border border-[#2D5A27] space-y-3">
                  <div className="space-y-1.5 text-gray-300 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-0.5">•</span>
                      <span>
                        The <strong className="text-white">progress bar</strong> shows your current level —
                        from <span className="text-gray-200">💤 Dormant</span> all the way to <span className="text-gray-200">👩‍🌾 Botanist</span>
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-300 mt-0.5">✦</span>
                      <span>
                        <strong className="text-amber-200">Tap the progress bar</strong> to see the full level progression and your position within it
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-0.5">•</span>
                      <span>Found words are color-coded by length: <span className="text-white">white</span>=4, <span className="text-green-400">green</span>=5, <span className="text-purple-400">purple</span>=6, <span className="text-amber-400">amber</span>=7+</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-0.5">•</span>
                      <span><span className="text-rose-400">Pink/rose</span> words are pangrams — worth the +10 bonus</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-0.5">•</span>
                      <span>Tap any found word to view its definition</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Button */}
            <div className="mt-5 pt-4 border-t border-[#2D5A27]">
              <button
                onClick={onClose}
                className="w-full bg-[#2D5A27] hover:bg-[#3D6A37] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
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
