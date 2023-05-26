import React, {
  useContext, useEffect, useMemo, useState, useCallback,
} from 'react';
import audius from '../../helpers/audius';
import { User } from '../../helpers/audius/types';

interface AuthContextProps {
    user: User | null,
    setUser: (userId: string) => Promise<void>
}

const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  setUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);

  const handleSetUser = useCallback(async (userId: string) => {
    const res = await audius.getUser(userId);
    setUser(res);
    localStorage.setItem('spicey-userId', userId);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('spicey-userId');
    if (!userId) {
      return;
    }
    handleSetUser(userId);
  }, [handleSetUser]);

  const value = useMemo(() => ({
    user,
    setUser: handleSetUser,
  }), [user, handleSetUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
