import React, {
  useContext, useEffect, useMemo, useState, useCallback,
} from 'react';
import audius from '../../helpers/audius';
import { User } from '../../helpers/audius/types';

interface AuthContextProps {
    user: User | null,
    setUser: (userId: string) => Promise<void>
    logout: () => void
}

const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  setUser: async () => {},
  logout: () => {},
});

const STORAGE_USER_ID = 'spicey-userId';

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);

  const handleSetUser = useCallback(async (userId: string) => {
    const res = await audius.getUser(userId);
    setUser(res);
    localStorage.setItem(STORAGE_USER_ID, userId);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_ID);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem(STORAGE_USER_ID);
    if (!userId) {
      return;
    }
    handleSetUser(userId);
  }, [handleSetUser]);

  const value = useMemo(() => ({
    user,
    setUser: handleSetUser,
    logout: handleLogout,
  }), [user, handleSetUser, handleLogout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
