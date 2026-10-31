import React, { createContext, useContext, useEffect, useState } from 'react';

export type DesignSystem = 'monolith' | 'sidi';

interface ThemeContextType {
  designSystem: DesignSystem;
  toggleDesignSystem: () => void;
}

const STORAGE_KEY = 'compose_lab_design_system';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const getStoredDesignSystem = (): DesignSystem => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'sidi' || stored === 'monolith') return stored;
  } catch {
    // Fallback
  }
  return 'monolith';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [designSystem, setDesignSystem] = useState<DesignSystem>(getStoredDesignSystem);

  useEffect(() => {
    document.documentElement.dataset.theme = designSystem;
    try {
      localStorage.setItem(STORAGE_KEY, designSystem);
    } catch {
      // Ignore
    }
  }, [designSystem]);

  const toggleDesignSystem = () => {
    setDesignSystem((current) => (current === 'monolith' ? 'sidi' : 'monolith'));
  };

  return (
    <ThemeContext.Provider value={{ designSystem, toggleDesignSystem }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useDesignSystem = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a ThemeProvider');
  }
  return context;
};
