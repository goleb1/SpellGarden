import { List } from '@phosphor-icons/react';
import WordInput from './WordInput';
import GameControls from './GameControls';

const noop = () => {};

const hexagon = "w-[80px] h-[92px] sm:w-[100px] sm:h-[115px] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] animate-pulse";

// Shown while the puzzle and saved progress load. It mirrors the real layout
// (same classes as page.tsx, GameHeader and LetterGrid) so nothing jumps when
// the game appears; if those layouts change, change this to match.
export default function GameSkeleton() {
  return (
    <main className="min-h-screen p-4 bg-bg text-ink flex flex-col h-screen" aria-busy="true" aria-label="Loading today's puzzle">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-8">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center">
            <div className="p-2 mr-2 flex items-center">
              <List size={24} weight="duotone" className="text-ink" />
            </div>
            <h1 className="text-2xl font-display font-bold leading-none">SpellGarden</h1>
          </div>
          <div className="sm:hidden text-2xl font-display font-bold min-w-[3ch]">&nbsp;</div>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-4 w-full sm:w-auto">
          <div className="h-8 bg-surface rounded-full w-full sm:w-auto sm:min-w-[300px] lg:min-w-[360px] animate-pulse" />
          <div className="hidden sm:block text-2xl font-display font-bold min-w-[3ch]">&nbsp;</div>
        </div>
      </div>

      {/* Game Container */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col min-h-0 wide:max-w-[1400px] wide:grid wide:grid-cols-[1fr_1px_minmax(350px,35%)] wide:gap-x-8">
        <div className="flex flex-col wide:min-h-0 pointer-events-none" aria-hidden="true">
          <WordInput currentWord="" />

          {/* Letter grid: blank tiles in the same spots as the real ones */}
          <div className="flex justify-center items-center">
            <div className="relative w-[min(400px,85vw)] h-[min(400px,85vw)] wide:w-[min(400px,50vw)] wide:h-[min(400px,50vw)] [--hex-radius:88px] sm:[--hex-radius:110px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`${hexagon} bg-gold-soft`} />
              </div>
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const angle = (index * 60 * Math.PI) / 180;
                const x = Math.cos(angle).toFixed(4);
                const y = Math.sin(angle).toFixed(4);
                return (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${x} * var(--hex-radius)), calc(-50% + ${y} * var(--hex-radius)))`,
                    }}
                  >
                    <div className={`${hexagon} bg-petal-idle`} />
                  </div>
                );
              })}
            </div>
          </div>

          <GameControls
            sortLabel="Newest"
            canSubmit={false}
            onSort={noop}
            onShuffle={noop}
            onDelete={noop}
            onSubmit={noop}
          />
        </div>

        {/* Vertical Divider */}
        <div className="hidden wide:block w-px bg-ink/15" />
      </div>
    </main>
  );
}
