import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getInitialGameState } from "../gameLogic";

interface GameState {
  foundWords: string[];
  score: number;
  lastUpdated: string;
  centerLetter: string;
  letters: string[];
  totalPossibleScore: number;
  validWords: string[];
  pangrams: string[];
  bingoIsPossible: boolean;
  id: string;
}

export const useGameState = (puzzleId: string) => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState | null>(null);
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
        console.log('Successfully migrated local storage to Firestore');
      }
    } catch (err) {
      console.error('Error migrating local storage to Firestore:', err);
      setError('Failed to migrate game data. Please try again.');
    }
  }, [puzzleId, user]);

  useEffect(() => {
    const loadState = async () => {
      try {
        // Get the initial game state from puzzle data
        const baseState = getInitialGameState();
        let state = {
          ...baseState,
          lastUpdated: new Date().toISOString(),
        };

        if (user) {
          // Load from Firestore for authenticated users
          const progressRef = doc(db, `users/${user.uid}/progress/${puzzleId}`);
          const docSnap = await getDoc(progressRef);
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
        
        setGameState(state);
        setError(null);
      } catch (err) {
        console.error("Error loading game state:", err);
        setError("Failed to load game state. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadState();
  }, [user, puzzleId, migrateLocalToFirestore]);

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