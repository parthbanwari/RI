import React from 'react';
import { LogOut, User } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/30 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
              My Calendar
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 ml-2">

            <div className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gray-50/80 dark:bg-gray-800/50 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <span className="font-medium truncate max-w-20 sm:max-w-none">{user}</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-transparent hover:border-red-200/50 dark:hover:border-red-800/50 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;