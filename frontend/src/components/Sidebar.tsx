import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  UploadCloud,
  Cpu,
  FileCheck2,
  Download,
  HelpCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { documentInfo, results } = useApp();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home, enabled: true },
    { name: 'Upload Document', path: '/upload', icon: UploadCloud, enabled: true },
    { name: 'Generate Q&A', path: '/processing', icon: Cpu, enabled: !!documentInfo },
    { name: 'Results', path: '/results', icon: FileCheck2, enabled: !!results },
    { name: 'Download', path: '/download', icon: Download, enabled: !!results },
  ];

  const secondaryItems = [
    { name: 'Help / Setup', path: '/help', icon: HelpCircle },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 h-screen sticky top-0 border-r border-slate-800 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight tracking-tight">
            Multilingual
          </h1>
          <p className="text-xs text-blue-400 font-medium tracking-wide">QnA Generator</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isDisabled = !item.enabled;

          if (isDisabled) {
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-slate-300 cursor-not-allowed opacity-50"
                title="Complete earlier steps to access"
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
          Resources
        </div>
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4 text-slate-300" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>OpenRouter Connected</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-300">
          English | Hindi | Marathi
        </div>
      </div>
    </aside>
  );
};
