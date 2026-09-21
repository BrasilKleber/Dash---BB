
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  headerExtra?: React.ReactNode;
  user: User;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, headerExtra, user }) => {
  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 flex items-center justify-between px-8 py-4 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">Gestão Blue Bolt</span>
        </div>
        
        <div className="flex items-center gap-6">
          {headerExtra}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{user.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
              <span className="text-xs font-bold">{user.name.charAt(0)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 p-8">
        <div className="w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

