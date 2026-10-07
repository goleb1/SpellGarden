import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchDailyPuzzles, formatLocalDate, type DailyPuzzles } from "../puzzleManager";

export const usePuzzle = () => {
  const [date, setDate] = useState<string | null>(null);
  const [puzzles, setPuzzles] = useState<DailyPuzzles | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Track the player's local date so the puzzle rolls over at their midnight
  useEffect(() => {
    const updateDate = () => setDate(formatLocalDate(new Date()));

    updateDate();
    const interval = setInterval(updateDate, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;

    fetchDailyPuzzles(date)
      .then(result => {
        if (cancelled) return;
        setPuzzles(result);
        setError(null);
      })
      .catch(err => {
        if (cancelled) return;
        console.error("Error loading puzzle:", err);
        setError("Couldn't load today's puzzle.");
      });

    return () => {
      cancelled = true;
    };
  }, [date, attempt]);

  const retry = useCallback(() => {
    setError(null);
    setAttempt(prev => prev + 1);
  }, []);

  const yesterdaysDate = useMemo(() => {
    const yesterday = date ? new Date(`${date}T00:00:00`) : new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return yesterday;
  }, [date]);

  return {
    puzzle: puzzles?.today ?? null,
    yesterdaysPuzzle: puzzles?.yesterday ?? null,
    yesterdaysDate,
    error,
    retry,
  };
};
