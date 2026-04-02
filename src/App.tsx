/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import questionsData from './questions.json';

interface Question {
  id: number;
  question: string;
  answer: string;
  explanation: string;
  type: string;
  image: string | null;
}

interface Progress {
  totalSolved: number;
  streak: number;
  lastSolvedDate: string | null;
}

type View = 'home' | 'result' | 'progress';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState<Progress>(() => {
    const saved = localStorage.getItem('daily_challenge_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if streak needs reset
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (parsed.lastSolvedDate && parsed.lastSolvedDate !== today && parsed.lastSolvedDate !== yesterday) {
        return { ...parsed, streak: 0 };
      }
      return parsed;
    }
    return { totalSolved: 0, streak: 0, lastSolvedDate: null };
  });

  const questions = questionsData as Question[];
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate today's question index
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const currentQuestionIndex = dayNumber % questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  const isAlreadySolvedToday = progress.lastSolvedDate === today;

  useEffect(() => {
    localStorage.setItem('daily_challenge_progress', JSON.stringify(progress));
  }, [progress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAlreadySolvedToday) return;

    const correct = userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
    setIsCorrect(correct);
    
    if (!isAlreadySolvedToday) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = progress.lastSolvedDate === yesterday ? progress.streak + 1 : 1;
      
      setProgress(prev => ({
        totalSolved: prev.totalSolved + 1,
        streak: newStreak,
        lastSolvedDate: today
      }));
    }
    
    setView('result');
  };

  const renderHome = () => {
    if (isAlreadySolvedToday && view === 'home') {
      return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-2xl font-light tracking-tight">Daily Thinking Challenge</h1>
          <div className="p-8 border border-gray-200 rounded-none w-full max-w-md bg-white">
            <p className="text-gray-500 mb-4 uppercase text-xs tracking-widest">Today's Status</p>
            <p className="text-lg">You have completed today's challenge!</p>
            <button 
              onClick={() => setView('result')}
              className="mt-6 px-6 py-2 border border-black text-black hover:bg-black hover:text-white uppercase text-xs tracking-widest"
            >
              View Result
            </button>
          </div>
          <button 
            onClick={() => setView('progress')}
            className="text-gray-400 hover:text-black uppercase text-xs tracking-widest"
          >
            Check Progress
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md mx-auto">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-tighter uppercase">Daily Challenge</h1>
          <p className="text-gray-400 text-xs tracking-widest uppercase">{today}</p>
        </header>

        <main className="w-full space-y-8 bg-white p-8 border border-gray-100">
          <div className="space-y-4">
            <span className="text-[10px] bg-gray-100 px-2 py-1 uppercase tracking-tighter text-gray-500">
              {currentQuestion.type}
            </span>
            <p className="text-xl leading-relaxed font-serif italic text-gray-800">
              "{currentQuestion.question}"
            </p>
            {currentQuestion.image && (
              <div className="pt-4">
                <img 
                  src={currentQuestion.image} 
                  alt="Challenge" 
                  className="max-w-full h-auto border border-gray-200"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your answer..."
              className="w-full p-3 border-b border-gray-300 focus:border-black outline-none text-center text-lg font-light"
              autoFocus
            />
            <button
              type="submit"
              disabled={!userAnswer.trim()}
              className="w-full py-3 border border-black uppercase text-xs tracking-[0.2em] hover:bg-black hover:text-white disabled:opacity-30"
            >
              Submit
            </button>
          </form>
        </main>

        <footer className="pt-4">
          <button 
            onClick={() => setView('progress')}
            className="text-gray-400 hover:text-black uppercase text-[10px] tracking-widest"
          >
            View My Progress
          </button>
        </footer>
      </div>
    );
  };

  const renderResult = () => {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md mx-auto">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-tighter uppercase">Result</h1>
          <p className={`text-xs tracking-widest uppercase ${isCorrect ? 'text-gray-900' : 'text-gray-400'}`}>
            {isCorrect ? 'Correct' : 'Completed'}
          </p>
        </header>

        <main className="w-full space-y-8 bg-white p-8 border border-gray-100">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">The Answer</p>
              <p className="text-2xl font-serif italic">{currentQuestion.answer}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Explanation</p>
              <p className="text-gray-600 leading-relaxed font-light">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>

          <button
            onClick={() => setView('home')}
            className="w-full py-3 border border-black uppercase text-xs tracking-[0.2em] hover:bg-black hover:text-white"
          >
            Back to Home
          </button>
        </main>

        <footer className="pt-4">
          <button 
            onClick={() => setView('progress')}
            className="text-gray-400 hover:text-black uppercase text-[10px] tracking-widest"
          >
            View My Progress
          </button>
        </footer>
      </div>
    );
  };

  const renderProgress = () => {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md mx-auto">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-tighter uppercase">Progress</h1>
          <p className="text-gray-400 text-xs tracking-widest uppercase">Your Journey</p>
        </header>

        <main className="w-full grid grid-cols-2 gap-4">
          <div className="bg-white p-8 border border-gray-100 flex flex-col items-center justify-center space-y-2">
            <p className="text-4xl font-light">{progress.totalSolved}</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Total Solved</p>
          </div>
          <div className="bg-white p-8 border border-gray-100 flex flex-col items-center justify-center space-y-2">
            <p className="text-4xl font-light">{progress.streak}</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Current Streak</p>
          </div>
        </main>

        <button
          onClick={() => setView('home')}
          className="w-full py-3 border border-black uppercase text-xs tracking-[0.2em] hover:bg-black hover:text-white"
        >
          Back to Challenge
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-black selection:text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-lg">
        {view === 'home' && renderHome()}
        {view === 'result' && renderResult()}
        {view === 'progress' && renderProgress()}
      </div>
    </div>
  );
}
