import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MobileDrawerMenu } from '../components/MobileDrawerMenu';

export interface MobileDrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const MobileDrawerContext = createContext<MobileDrawerContextType>({
  isOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  toggleDrawer: () => {},
});

export const MobileDrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <MobileDrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer, toggleDrawer }}>
      {children}
      <MobileDrawerMenu visible={isOpen} onClose={closeDrawer} />
    </MobileDrawerContext.Provider>
  );
};

export const useMobileDrawer = (): MobileDrawerContextType => useContext(MobileDrawerContext);
