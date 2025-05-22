'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQAccordionItemProps {
  question: string;
  answer: string;
  color: string; // Color in format "#hex"
  isOpen?: boolean; 
  toggleOpen?: () => void;
}

const FAQAccordionItem: React.FC<FAQAccordionItemProps> = ({ 
  question, 
  answer, 
  color,
  isOpen = false,
  toggleOpen
}) => {
  // If toggleOpen is provided, use controlled state, otherwise use internal state
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  const isExpanded = toggleOpen ? isOpen : internalIsOpen;
  const handleToggle = () => {
    if (toggleOpen) {
      toggleOpen();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <motion.div 
      layout="position"
      className={`group bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'shadow-md' : 'hover:shadow-md'} ${isExpanded ? '' : 'hover:translate-y-[-2px]'}`}
      style={{ 
        borderColor: isExpanded ? `${color}4D` : undefined,
        borderWidth: '1px',
        willChange: 'transform, opacity, box-shadow',
        contain: 'content'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button 
        onClick={handleToggle}
        className="w-full text-left p-7 focus:outline-none"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start">
          <div className="mr-4 mt-1">
            <motion.div 
              className="flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-300"
              style={{ 
                backgroundColor: isExpanded ? color : `${color}19`,
                color: isExpanded ? 'white' : color
              }}
              whileHover={{ 
                backgroundColor: color,
                color: 'white',
                scale: 1.05
              }}
            >
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-3.5 w-3.5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isExpanded ? (
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                )}
              </motion.svg>
            </motion.div>
          </div>
          <div className="flex-1">
            <motion.h3 
              className="font-bold text-lg transition-colors duration-300"
              style={{ 
                color: isExpanded ? color : '#00305f'
              }}
              whileHover={{ 
                color: color
              }}
            >
              {question}
            </motion.h3>
          </div>
          <motion.div 
            className="ml-2 flex items-center text-gray-400"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>
      </button>

      <AnimatePresence mode="sync">
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.35, ease: "easeInOut" }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.15, ease: "easeInOut" }
              }
            }}
            className="overflow-hidden"
            style={{ 
              willChange: 'height, opacity', 
              transformOrigin: 'top center',
              containIntrinsicSize: 'auto'
            }}
          >
            <motion.div 
              className="px-7 pb-7 pt-0"
              initial={{ y: -5, opacity: 0, scale: 0.98 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                scale: 1,
                transition: { 
                  duration: 0.25, 
                  delay: 0.05,
                  ease: "easeOut"
                }
              }}
              style={{ transformOrigin: 'top center' }}
            >
              <div className="pl-10 border-l-2" style={{ borderColor: `${color}30` }}>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {answer}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQAccordionItem; 