import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-out cursor-pointer"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white/95 backdrop-blur-xl dark:bg-gray-800/95 rounded-2xl px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 text-left overflow-hidden shadow-2xl transform transition-all duration-300 ease-out scale-100 my-4 sm:my-8 align-middle w-full max-w-xs xs:max-w-sm sm:max-w-lg border border-gray-200/20 dark:border-gray-600/30 mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight pr-2">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 ease-in-out cursor-pointer flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;