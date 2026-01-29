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
            className="relative bg-[#1C1C1E] rounded-xl shadow-xl w-[95%] sm:w-[90%] md:w-[85%] lg:w-[900px] min-w-[280px] mx-4 p-6 border border-[#2D5A27] overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  How to Play
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Game Objective Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  🎯 Game Objective
                </h3>
                <div className="bg-[#142911] rounded-lg p-4 border border-[#2D5A27]">
                  <p className="text-gray-300 mb-3">
                    Create words using the letters in the hexagon grid. Every word must:
                  </p>
                  <ul className="space-y-2 text-gray-300 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-1">•</span>
                      <span>Include the <strong className="text-white">center letter</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-1">•</span>
                      <span>Be at least <strong className="text-white">4 letters long</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4ADE80] mt-1">•</span>
                      <span>Use only the letters provided in the grid</span>
                    </li>
                  </ul>
                  
                  {/* Visual Example */}
                  <div className="mt-4 flex justify-center">
                    <div className="flex gap-1.5">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#2D5A27] text-white font-bold text-lg">
                        G
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#333333] text-white font-bold text-lg">
                        A
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#333333] text-white font-bold text-lg">
                        R
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#333333] text-white font-bold text-lg">
                        D
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#333333] text-white font-bold text-lg">
                        E
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#333333] text-white font-bold text-lg">
                        N
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#333333] text-white font-bold text-lg">
                        S
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-2">
                    Center letter (G) must be in every word
                  </p>
                </div>
              </div>

              {/* Scoring System Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  🏆 Scoring System
                </h3>
                <div className="bg-[#142911] rounded-lg p-4 border border-[#2D5A27] space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-2 bg-[#1C1C1E] rounded">
                      <span className="text-gray-300">4-letter words</span>
                      <span className="text-white font-bold">1 point</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#1C1C1E] rounded">
                      <span className="text-gray-300">5+ letter words</span>
                      <span className="text-white font-bold">1 point per letter</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#2D5A27] rounded border border-green-600">
                      <span className="text-white">Pangrams (all 7 letters)</span>
                      <span className="text-[#4ADE80] font-bold">+10 bonus points</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#2D5A27] rounded border border-yellow-600">
                      <span className="text-white">Bingo (found a word starting with each letter)</span>
                      <span className="text-[#fbbf24] font-bold">+10 bonus points</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-[#1C1C1E] rounded text-sm">
                    <p className="text-gray-300 mb-2"><strong className="text-white">Examples:</strong></p>
                    <div className="space-y-1 text-gray-300">
                      <div>AGES (4 letters) = 1 point</div>
                      <div>GRADE (5 letters) = 5 points</div>
                      <div>GARDENS (7 letters, pangram) = 7 + 10 = 17 points</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-yellow-900/20 rounded text-sm border border-yellow-600/30">
                    <p className="text-yellow-200 mb-2">
                      <strong>Bingo Bonus:</strong> Look for the 🪴 emoji in the top left to see if today&apos;s puzzle has a bingo available!
                    </p>
                    <p className="text-yellow-200">
                      <strong>Visual Tracking:</strong> Letter tiles start dim and brighten once you find a word starting with each letter.
                    </p>
                  </div>
                </div>
              </div>

              {/* Playing the Game Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  🎮 Playing the Game
                </h3>
                <div className="bg-[#142911] rounded-lg p-4 border border-[#2D5A27] space-y-4">
                  
                  {/* Input & Controls */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">⌨️ Creating Words</h4>
                    <div className="space-y-2 text-gray-300 text-sm ml-4">
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Input methods:</strong> Type on keyboard or click letters in the hexagon grid</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Center letter (yellow):</strong> Must be included in every word you submit</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Word input:</strong> Your current word appears in the text field above the grid</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Bingo tracking:</strong> When a bingo is available, letters start dim and brighten when you find a word starting with that letter</span>
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">🔧 Game Controls</h4>
                    <div className="space-y-2 text-gray-300 text-sm ml-4">
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Enter:</strong> Submit your word (or press Enter key)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Delete:</strong> Remove the last letter from your current word</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Shuffle:</strong> Rearrange the outer letters for a fresh perspective</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Sort:</strong> Organize found words by time (⏪), alphabet (🔤), or length (📶)</span>
                      </div>
                    </div>
                  </div>

                  {/* Found Words & Progress */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">📊 Progress & Results</h4>
                    <div className="space-y-2 text-gray-300 text-sm ml-4">
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Word colors:</strong> Length-based (white=4, green=5, purple=6, amber=7+)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Pink/rose words:</strong> Pangrams (use all 7 letters) - worth bonus points!</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Click any word:</strong> View definition and pronunciation</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Progress bar:</strong> Shows your level (Seedling 🌱 → Botanist 🌳) and score progress</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu & Features */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">🔍 Additional Features</h4>
                    <div className="space-y-2 text-gray-300 text-sm ml-4">
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Hamburger menu (☰):</strong> Access hints, yesterday&apos;s puzzle, and this guide</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Info area (ⓘ):</strong> Shows if puzzle has pangrams 🌱 or bingo 🪴 bonuses available</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#4ADE80] mt-1">•</span>
                        <span><strong className="text-white">Score display:</strong> Your total points for today&apos;s puzzle</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer Button */}
            <div className="mt-6 pt-4 border-t border-[#2D5A27]">
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