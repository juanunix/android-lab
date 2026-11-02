import React, { createContext, useContext, useEffect, useState } from 'react';
import { SKILLS_AUTH } from '../config/skillsAuth';

interface SkillAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const SkillAuthContext = createContext<SkillAuthContextType | undefined>(undefined);

export const SkillAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SKILLS_AUTH.storageKey) === 'authenticated';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isAuthenticated) {
        sessionStorage.setItem(SKILLS_AUTH.storageKey, 'authenticated');
      } else {
        sessionStorage.removeItem(SKILLS_AUTH.storageKey);
      }
    } catch {
      // Ignore storage errors
    }
  }, [isAuthenticated]);

  const login = (username: string, password: string) => {
    const valid =
      username.trim() === SKILLS_AUTH.username && password === SKILLS_AUTH.password;
    if (valid) {
      setIsAuthenticated(true);
    }
    return valid;
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <SkillAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </SkillAuthContext.Provider>
  );
};

export const useSkillAuth = (): SkillAuthContextType => {
  const context = useContext(SkillAuthContext);
  if (!context) {
    throw new Error('useSkillAuth must be used within a SkillAuthProvider');
  }
  return context;
};
