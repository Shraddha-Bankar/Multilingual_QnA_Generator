import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Sparkles, FileText, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { documentInfo } = useApp();
  const location = useLocation();

  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Title */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-base">
              Multilingual QnA
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
              v1.0
            </span>
          </div>
        </Link>

        {/* Current Document Badge or Landing Links */}
        <div className="flex items-center gap-4">
          {isLanding ? (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="#workflow" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                How It Works
              </a>
              <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Features
              </a>
              <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                About
              </Link>
              <Link to="/help" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Setup
              </Link>
            </nav>
          ) : documentInfo ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-medium truncate max-w-[180px]">{documentInfo.filename}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">{documentInfo.detected_language}</span>
            </div>
          ) : null}

          {/* Language Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>EN / HI / MR</span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Action CTA on landing */}
          {isLanding && (
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              Start Generating
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
