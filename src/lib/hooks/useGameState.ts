import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getInitialGameState, type GameState } from "../gameLogic";
import type { Puzzle } from "../puzzleManager";

// What gets saved: the game state plus when it was last touched
type SavedGameState = GameState & { lastUpdated: string };

export const useGameState = (puzzle: Puzzle | null) => {
  const { user, loading: authLoading } = useAuth();
  const puzzleId = puzzle?.id;
  const [gameState, setGameState] = useState<SavedGameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to migrate local storage to Firestore
  const migrateLocalToFirestore = useCallback(async () => {
    try {
      const localState = localStorage.getItem(`gameState_${puzzleId}`);
      if (localState && user) {
        const state = JSON.parse(localState);
        const progressRef = doc(db, `users/${user.uid}/progress/${puzzleId}`);
        await setDoc(progressRef, {
          ...state,
          lastUpdated: new Date().toISOString(),
        });
        // Clear local storage after successful migration
        localStorage.removeItem(`gameState_${puzzleId}`);
      }
    } catch (err) {
      console.error('Error migrating local storage to Firestore:', err);
      setError('Failed to migrate game data. Please try again.');
    }
  }, [puzzleId, user]);

  useEffect(() => {
    // Wait for the puzzle to arrive from the server, and for Firebase to tell
    // us whether someone is signed in. Loading before then treats a signed-in
    // player as a guest and briefly shows the wrong progress.
    if (!puzzle || authLoading) return;

    // Set when the player or puzzle changes mid-load, so a slow earlier load
    // can't overwrite the newer one.
    let cancelled = false;

    const loadState = async () => {
      try {
        // Get the initial game state from puzzle data
        const baseState = getInitialGameState(puzzle);
        let state: SavedGameState = {
          ...baseState,
          lastUpdated: new Date().toISOString(),
        };

        if (user) {
          // Load from Firestore for authenticated users
          const progressRef = doc(db, `users/${user.uid}/progress/${puzzleId}`);
          const docSnap = await getDoc(progressRef);
          if (cancelled) return;
          if (docSnap.exists()) {
            // Merge Firestore data with base state to ensure all required fields
            const firestoreData = docSnap.data();
            state = {
              ...state,
              ...firestoreData,
              // Ensure these are always from base state
              centerLetter: baseState.centerLetter,
              letters: baseState.letters,
              validWords: baseState.validWords,
              pangrams: baseState.pangrams,
              totalPossibleScore: baseState.totalPossibleScore,
              bingoIsPossible: baseState.bingoIsPossible,
            };
          } else {
            // Check for local storage data to migrate
            const localState = localStorage.getItem(`gameState_${puzzleId}`);
            if (localState) {
              const parsedLocalState = JSON.parse(localState);
              state = {
                ...state,
                foundWords: parsedLocalState.foundWords || [],
                score: parsedLocalState.score || 0,
              };
              // Migrate local storage to Firestore
              await migrateLocalToFirestore();
            }
            // Initialize new puzzle progress in Firestore
            await setDoc(progressRef, state);
          }
        } else {
          // Load from localStorage for guests
          const savedState = localStorage.getItem(`gameState_${puzzleId}`);
          if (savedState) {
            const parsedSavedState = JSON.parse(savedState);
            state = {
              ...state,
              foundWords: parsedSavedState.foundWords || [],
              score: parsedSavedState.score || 0,
            };
          }
          localStorage.setItem(`gameState_${puzzleId}`, JSON.stringify(state));
        }

        if (cancelled) return;
        setGameState(state);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading game state:", err);
        setError("Failed to load game state. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadState();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, puzzle, puzzleId, migrateLocalToFirestore]);

  const updateState = async (newState: Partial<GameState>) => {
    if (!gameState) return;

    try {
      const updatedState = {
        ...gameState,
        ...newState,
        lastUpdated: new Date().toISOString(),
      };
      setGameState(updatedState);

      if (user) {
        // Update Firestore for authenticated users
        const progressRef = doc(db, `users/${user.uid}/progress/${puzzleId}`);
        await updateDoc(progressRef, {
          foundWords: updatedState.foundWords,
          score: updatedState.score,
          lastUpdated: updatedState.lastUpdated,
        });
      } else {
        // Update localStorage for guests
        localStorage.setItem(`gameState_${puzzleId}`, JSON.stringify(updatedState));
      }
      setError(null);
    } catch (err) {
      console.error("Error updating game state:", err);
      setError("Failed to save game state. Please try again.");
    }
  };

  return { gameState, updateState, loading, error };
}; 