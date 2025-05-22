'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import FAQAccordionItem from './FAQAccordionItem';

const FAQ_ITEMS = [
  {
    id: 1,
    question: "Is CourseCentral connected to SOLUS?",
    answer: "CourseCentral is not officially connected to SOLUS, but we've collected grade distribution data from multiple reliable sources. You'll need to register for courses through SOLUS after researching them on our platform.",
    color: "#d62839"
  },
  {
    id: 2,
    question: "Where does the chatbot get its information?",
    answer: "Our AI advisor is trained on thousands of student reviews from Queen's course catalogs, Reddit discussions, and RateMyProfessor reviews to provide you with comprehensive insights about courses and professors.",
    color: "#00305f"
  },
  {
    id: 3,
    question: "How up-to-date is the grade data?",
    answer: "We update our database each semester with the latest grade distributions and course information to ensure you have access to the most current data for decision making.",
    color: "#efb215"
  },
  {
    id: 4,
    question: "Is this tool free?",
    answer: "Yes, CourseCentral is completely free for all Queen's University students. We believe in making data-driven course selection accessible to everyone.",
    color: "#d62839"
  },
  {
    id: 5,
    question: "What courses are supported?",
    answer: "Currently, CourseCentral only supports on-campus courses at Queen's University. We're working on adding support for online courses in the future, but for now, our data and AI assistant focus exclusively on in-person course offerings.",
    color: "#00305f"
  }
];

const FAQAccordionSection: React.FC = () => {
  // State to track which FAQ item is open
  const [openItemId, setOpenItemId] = useState<number | null>(null); // No item open by default
  
  // Refs to access the DOM elements
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  
  // Set up refs array
  if (itemRefs.current.length !== FAQ_ITEMS.length) {
    itemRefs.current = Array(FAQ_ITEMS.length).fill(null);
  }

  // Toggle function to handle accordion behavior
  const toggleItem = (id: number) => {
    // If closing the current item, just close it
    if (openItemId === id) {
      setOpenItemId(null);
      return;
    }
    
    // If opening a new item
    setOpenItemId(id);
    
    // Only scroll if the element is outside the viewport or partially visible
    setTimeout(() => {
      const element = itemRefs.current[id - 1];
      if (element) {
        const rect = element.getBoundingClientRect();
        const isInView = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        
        // Only scroll if not fully in view
        if (!isInView) {
          const yOffset = -120; // Offset from the top of the viewport
          const y = rect.top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }
    }, 50); // Slightly reduced delay for better responsiveness
  };

  return (
    <motion.div 
      className="space-y-5 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        minHeight: '540px', 
        perspective: '1000px',
        perspectiveOrigin: 'top center'
      }}
    >
      {FAQ_ITEMS.map((item, index) => (
        <div
          key={item.id}
          ref={(el) => {
            if (el) itemRefs.current[index] = el;
          }}
          className="relative"
        >
          <FAQAccordionItem
            question={item.question}
            answer={item.answer}
            color={item.color}
            isOpen={openItemId === item.id}
            toggleOpen={() => toggleItem(item.id)}
          />
        </div>
      ))}
    </motion.div>
  );
};

export default FAQAccordionSection; 