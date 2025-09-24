import React from 'react';
import { LogOut, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../hooks/UseTheme';

const Navbar = ({ user, onLogout }) => {
   const { theme, toggleTheme } = useTheme();
  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/30 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              My Calendar
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 text-sm text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50">
              <User className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="font-medium">{user}</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-transparent hover:border-red-200/50 dark:hover:border-red-800/50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;