
import React, { createContext, useContext, useState } from 'react';

type CRMView = 
  | 'dashboard' 
  | 'clients' 
  | 'client-detail' 
  | 'campaigns' 
  | 'campaign-detail' 
  | 'tasks';

interface NavigationContextType {
  currentView: CRMView;
  params: any;
  navigate: (view: CRMView, params?: any) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const CRMNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<CRMView>('dashboard');
  const [params, setParams] = useState<any>({});

  const navigate = (view: CRMView, newParams: any = {}) => {
    setCurrentView(view);
    setParams(newParams);
  };

  return (
    <NavigationContext.Provider value={{ currentView, params, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigate = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigate must be used within a CRMNavigationProvider');
  }
  return context.navigate;
};

export const useNavigationParams = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationParams must be used within a CRMNavigationProvider');
  }
  return context.params;
};

export const useCurrentView = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useCurrentView must be used within a CRMNavigationProvider');
  }
  return context.currentView;
};
