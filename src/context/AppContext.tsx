import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Role } from '../types';

interface AppState {
  userId: number | null;
  role: Role | null;
  userName: string | null;
}

interface AppContextValue extends AppState {
  setUser: (userId: number, role: Role, userName: string) => void;
  clearUser: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    userId: null,
    role: null,
    userName: null,
  });

  const setUser = (userId: number, role: Role, userName: string) => {
    setState({ userId, role, userName });
  };

  const clearUser = () => {
    setState({ userId: null, role: null, userName: null });
  };

  return (
    <AppContext.Provider value={{ ...state, setUser, clearUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
