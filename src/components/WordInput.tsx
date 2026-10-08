import { motion, AnimatePresence } from 'framer-motion';

export interface GameMessage {
  text: string;
  type: 'error' | 'success';
}

interface WordInputProps {
  currentWord: string;
  message?: GameMessage;
}

export default function WordInput({ currentWord, message }: WordInputProps) {
  return (
    <div className="relative mt-8 sm:mt-4 mb-2 sm:mb-4 flex justify-center">
      {/* Absolutely positioned message - the top margin keeps it clear of the header */}
      <div className="absolute left-0 right-0 bottom-full mb-1 sm:mb-2">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-center text-lg font-semibold ${
                message.type === 'error' ? 'text-red-400' : 'text-leaf'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-full sm:max-w-md md:max-w-lg min-h-[2.75rem] sm:min-h-[3.25rem] flex items-center justify-center px-4">
        {currentWord ? (
          <div className="font-display text-2xl sm:text-3xl font-bold tracking-wide flex items-baseline">
            <span>{currentWord}</span>
            <span className="inline-block w-[3px] h-[0.95em] bg-gold ml-[3px] animate-caret" />
          </div>
        ) : (
          <div className="font-display text-lg sm:text-xl text-muted">
            Type or click letters
          </div>
        )}
      </div>
    </div>
  );
}
