import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Role } from '../types';

interface AppState {
  userId: number | null;
  role: Role | null;
  userName: string | null;
  email: string | null;
}

interface AppContextValue extends AppState {
  setUser: (userId: number, role: Role, userName: string, email: string) =&gt; void;
  clearUser: () =&gt; void;
}

const AppContext = createContext&lt;AppContextValue | null&gt;(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState&lt;AppState&gt;(() =&gt; {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { userId: null, role: null, userName: null, email: null };
      }
    }
    return { userId: null, role: null, userName: null, email: null };
  });

  useEffect(() =&gt; {
    if (state.userId) {
      localStorage.setItem('user', JSON.stringify(state));
    } else {
      localStorage.removeItem('user');
    }
  }, [state]);

  const setUser = (userId: number, role: Role, userName: string, email: string) =&gt; {
    setState({ userId, role, userName, email });
  };

  const clearUser = () =&gt; {
    setState({ userId: null, role: null, userName: null, email: null });
  };

  return (
    &lt;AppContext.Provider value={{ ...state, setUser, clearUser }}&gt;
      {children}
    &lt;/AppContext.Provider&gt;
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
