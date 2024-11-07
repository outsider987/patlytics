"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Analysis {
  analysis_id: string;
  company_name: string;
  patent_id: string;
  analysis_date: string;
  top_infringing_products: Array<{
    infringement_likelihood: "High" | "Medium" | "Low";
  }>;
  // Add other analysis properties as needed
}

interface HistoryContextType {
  analysisHistory: Analysis[];
  saveAnalysis: (analysis: Analysis) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [analysisHistory, setAnalysisHistory] = useState<Analysis[]>([]);

  useEffect(() => {
    // Load history from localStorage on mount
    const savedHistory = localStorage.getItem('analysisHistory');
    if (savedHistory) {
      setAnalysisHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveAnalysis = (analysis: Analysis) => {
    setAnalysisHistory((prevHistory) => {
      const newHistory = [analysis, ...prevHistory];
      localStorage.setItem('analysisHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem('analysisHistory');
    setAnalysisHistory([]);
  };

  return (
    <HistoryContext.Provider value={{ analysisHistory, saveAnalysis, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
