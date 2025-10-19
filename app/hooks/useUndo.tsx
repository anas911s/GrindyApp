// app/hooks/useUndo.tsx
import { useCallback } from 'react';
import { loadJSON, saveJSON } from '../utils/storage';
const UNDO_KEY = '@grindy:undo_stack_v1';

export function useUndo() {
  const push = useCallback(async (entry: any) => {
    const u = await loadJSON<any[]>(UNDO_KEY) || [];
    u.unshift(entry);
    if (u.length > 50) u.pop();
    await saveJSON(UNDO_KEY, u);
  }, []);

  const pop = useCallback(async () => {
    const u = await loadJSON<any[]>(UNDO_KEY) || [];
    const e = u.shift();
    await saveJSON(UNDO_KEY, u);
    return e;
  }, []);

  return { push, pop };
}
