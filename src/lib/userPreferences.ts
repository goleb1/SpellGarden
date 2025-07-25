import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase/firebase';
import { User } from 'firebase/auth';

interface UserPreferences {
  hasSeenTutorial: boolean;
  tutorialCompletedAt?: string;
  lastPlayedDate?: string;
  preferredSortMode?: 'alphabetical' | 'length' | 'chronological';
  version?: string;
}

export class UserPreferencesManager {
  private static STORAGE_KEY = 'spellgarden_preferences';
  private static VERSION = '1.0';

  // Get preferences for authenticated users from Firestore
  static async getPreferences(user?: User | null): Promise<UserPreferences> {
    if (user) {
      try {
        const prefsRef = doc(db, `users/${user.uid}/preferences/main`);
        const docSnap = await getDoc(prefsRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            hasSeenTutorial: false,
            version: this.VERSION,
            ...data,
          };
        } else {
          // Return defaults for new authenticated users
          return { hasSeenTutorial: false, version: this.VERSION };
        }
      } catch (error) {
        console.error('Error reading user preferences from Firestore:', error);
        return { hasSeenTutorial: false, version: this.VERSION };
      }
    }

    // Fallback to localStorage for guest users
    if (typeof window === 'undefined') {
      return { hasSeenTutorial: false };
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return { hasSeenTutorial: false, version: this.VERSION };
      }

      const parsed = JSON.parse(stored);
      return {
        hasSeenTutorial: false,
        version: this.VERSION,
        ...parsed,
      };
    } catch (error) {
      console.error('Error reading user preferences from localStorage:', error);
      return { hasSeenTutorial: false, version: this.VERSION };
    }
  }

  // Set preferences for authenticated users in Firestore
  static async setPreferences(prefs: Partial<UserPreferences>, user?: User | null): Promise<void> {
    if (user) {
      try {
        const current = await this.getPreferences(user);
        const updated = { ...current, ...prefs, version: this.VERSION };
        const prefsRef = doc(db, `users/${user.uid}/preferences/main`);
        await setDoc(prefsRef, updated, { merge: true });
        return;
      } catch (error) {
        console.error('Error saving user preferences to Firestore:', error);
        // Fallback to localStorage if Firestore fails
      }
    }

    // Fallback to localStorage for guest users or if Firestore fails
    if (typeof window === 'undefined') return;

    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...prefs, version: this.VERSION };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving user preferences to localStorage:', error);
    }
  }

  static async isFirstTimeUser(user?: User | null): Promise<boolean> {
    const prefs = await this.getPreferences(user);
    return !prefs.hasSeenTutorial;
  }

  static async markTutorialSeen(user?: User | null): Promise<void> {
    await this.setPreferences({
      hasSeenTutorial: true,
      tutorialCompletedAt: new Date().toISOString(),
    }, user);
  }

  static async resetTutorialStatus(user?: User | null): Promise<void> {
    await this.setPreferences({
      hasSeenTutorial: false,
      tutorialCompletedAt: undefined,
    }, user);
  }

  // Migrate localStorage preferences to Firestore when user signs in
  static async migrateToFirestore(user: User): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const localPrefs = JSON.parse(stored);
        const firestorePrefs = await this.getPreferences(user);
        
        // Only migrate if Firestore doesn't have tutorial completion info
        if (!firestorePrefs.hasSeenTutorial && localPrefs.hasSeenTutorial) {
          await this.setPreferences(localPrefs, user);
          console.log('Migrated preferences to Firestore');
        }
      }
    } catch (error) {
      console.error('Error migrating preferences to Firestore:', error);
    }
  }
}