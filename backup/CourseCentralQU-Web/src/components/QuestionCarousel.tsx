'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample questions data with names, titles and descriptions
const SAMPLE_QUESTIONS = [
  {
    name: "Sally Sharpe",
    title: "Marketing Admin",
    question: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, suscipit?"
  },
  {
    name: "Michael John",
    title: "Cybersecurity Engineer",
    question: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, dolore."
  },
  {
    name: "Mikayla Eddie",
    title: "Software Engineer",
    question: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, temporibus?"
  },
  {
    name: "James Wilson",
    title: "Economics Major",
    question: "Which courses have the best professors in the Economics department?"
  },
  {
    name: "Aisha Patel",
    title: "Computer Science Student",
    question: "What's the average grade distribution for CISC 121 over the past two years?"
  },
  {
    name: "Noah Kim",
    title: "Biology Major",
    question: "Are there any hidden gem electives that relate to marine biology?"
  },
  {
    name: "Olivia Chen",
    title: "Psychology Student",
    question: "Which PSYC professors have the most engaging teaching style?"
  },
  {
    name: "Marcus Johnson",
    title: "Engineering Student",
    question: "What's the workload like for MECH 328 compared to other third-year courses?"
  }
];

interface QuestionCarouselProps {
  onQuestionSelect?: (question: string) => void;
}

const QuestionCarousel: React.FC<QuestionCarouselProps> = ({ onQuestionSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState<number[]>([0, 1, 2]);

  // Auto-rotate the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % SAMPLE_QUESTIONS.length;
        updateVisibleCards(newIndex);
        return newIndex;
      });
    }, 3000); // Change card every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const updateVisibleCards = (centerIndex: number) => {
    const totalCards = SAMPLE_QUESTIONS.length;
    // Calculate previous and next indices with wrapping
    const prevIndex = (centerIndex - 1 + totalCards) % totalCards;
    const nextIndex = (centerIndex + 1) % totalCards;
    setVisibleCards([prevIndex, centerIndex, nextIndex]);
  };

  const handleCardClick = (index: number, question: string) => {
    if (onQuestionSelect && index === visibleCards[1]) { // Only respond to center card
      onQuestionSelect(question);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 overflow-hidden">
      <div className="relative h-[400px] flex items-center justify-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-purple-600 rounded-3xl -z-10"></div>
        
        {/* Card container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {visibleCards.map((questionIndex, i) => {
              const item = SAMPLE_QUESTIONS[questionIndex];
              // Position: 0 = left, 1 = center, 2 = right
              const isCenter = i === 1;
              
              return (
                <motion.div
                  key={`card-${questionIndex}`}
                  className={`absolute bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col cursor-pointer transition-all duration-300 select-none
                    ${isCenter ? 'z-20 w-[95%] sm:w-[80%] md:w-[60%] scale-100' : 'z-10 w-[85%] sm:w-[70%] md:w-[50%] scale-90 opacity-70'}`}
                  style={{
                    left: i === 0 ? '10%' : i === 1 ? '50%' : '90%',
                    transform: `translateX(${i === 0 ? '-60%' : i === 1 ? '-50%' : '-40%'}) scale(${isCenter ? 1 : 0.9})`,
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: isCenter ? 1 : 0.7, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => handleCardClick(questionIndex, item.question)}
                >
                  <div className="mb-4 flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden">
                      {/* Placeholder for avatar */}
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-purple-600">{item.name}</h3>
                      <p className="text-gray-600">{item.title}</p>
                    </div>
                  </div>
                  <p className="text-gray-800 text-lg">{item.question}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {SAMPLE_QUESTIONS.map((_, index) => (
            <button
              key={`dot-${index}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-purple-300 opacity-50'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                updateVisibleCards(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionCarousel; 