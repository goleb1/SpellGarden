import { SortAscending, Shuffle as ShuffleIcon, Backspace, ArrowElbowDownLeft } from '@phosphor-icons/react';

interface GameControlsProps {
  sortLabel: string;
  canSubmit: boolean;
  onSort: () => void;
  onShuffle: () => void;
  onDelete: () => void;
  onSubmit: () => void;
}

const secondaryButton = "flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-6 py-1.5 sm:py-2.5 rounded-2xl border border-ink/15 bg-surface hover:bg-surface/70 text-ink transition-colors text-sm sm:text-base whitespace-nowrap";

export default function GameControls({ sortLabel, canSubmit, onSort, onShuffle, onDelete, onSubmit }: GameControlsProps) {
  return (
    <div className="grid grid-cols-2 sm:flex sm:justify-center gap-1.5 sm:gap-4 mt-2 sm:mt-6">
      <button className={`${secondaryButton} order-1 sm:order-1`} onClick={onSort}>
        <SortAscending size={16} weight="duotone" className="text-leaf shrink-0" />
        {sortLabel}
      </button>
      <button className={`${secondaryButton} order-2 sm:order-2`} onClick={onShuffle}>
        <ShuffleIcon size={16} weight="duotone" className="text-leaf shrink-0" />
        Shuffle
      </button>
      <button className={`${secondaryButton} order-3 sm:order-3`} onClick={onDelete}>
        <Backspace size={16} weight="duotone" className="text-leaf shrink-0" />
        Delete
      </button>
      <button
        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-7 py-1.5 sm:py-2.5 rounded-2xl bg-gold text-gold-ink font-semibold hover:bg-gold/90 transition-colors text-sm sm:text-base whitespace-nowrap order-4 sm:order-4 ${
          canSubmit ? '' : 'opacity-50 cursor-not-allowed'
        }`}
        onClick={onSubmit}
        disabled={!canSubmit}
      >
        <ArrowElbowDownLeft size={16} weight="duotone" className="shrink-0" />
        Enter
      </button>
    </div>
  );
}
