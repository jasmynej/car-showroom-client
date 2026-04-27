import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Role } from '../types';

interface AppState {
  userId: string | null;
  role: Role | null;
  userName: string | null;
}

interface AppContextValue extends AppState {
  setUser: (userId: string, role: Role, userName: string) =&gt; void;
  clearUser: () =&gt; void;
  isAuthenticated: () =&gt; boolean;
  hasRole: (role: Role) =&gt; boolean;
}

const AppContext = createContext&lt;AppContextValue | null&gt;(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState&lt;AppState&gt;(() =&gt; {
    // Restore from sessionStorage on mount
    const stored = sessionStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { userId: null, role: null, userName: null };
      }
    }
    return { userId: null, role: null, userName: null };
  });

  useEffect(() =&gt; {
    // Persist to sessionStorage on change
    if (state.userId &amp;&amp; state.role &amp;&amp; state.userName) {
      sessionStorage.setItem('user', JSON.stringify(state));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [state]);

  const setUser = (userId: string, role: Role, userName: string) =&gt; {
    setState({ userId, role, userName });
  };

  const clearUser = () =&gt; {
    setState({ userId: null, role: null, userName: null });
    sessionStorage.removeItem('user');
  };

  const isAuthenticated = () =&gt; {
    return state.userId !== null &amp;&amp; state.role !== null;
  };

  const hasRole = (role: Role) =&gt; {
    return state.role === role;
  };

  return (
    &lt;AppContext.Provider value={{ ...state, setUser, clearUser, isAuthenticated, hasRole }}&gt;
      {children}
    &lt;/AppContext.Provider&gt;
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
