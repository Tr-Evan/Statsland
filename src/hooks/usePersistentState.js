import { useState, useEffect } from 'react';

export function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(key);
    try {
      const parsed = stored ? JSON.parse(stored) : initialValue;
      // Si on attend un tableau, force le tableau
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}