import { useState, useEffect } from 'react';

export type AnalysisData = {
  analysis_id: string;
  patent_id: string;
  company_name: string;
  analysis_date: string;
  top_infringing_products: SpecificProduct[];
  overall_risk_assessment: string;
};

type SpecificProduct = {
  product_name: string;
  infringement_likelihood: string;
  relevant_claims: string[];
  explanation: string;
  specific_features: string[];
};

const STORAGE_KEY = 'patent-analysis-history';

export const useAnalysisStorage = () => {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisData[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAnalysisHistory(JSON.parse(stored));
    }
  }, []);

  const saveAnalysis = (analysis: AnalysisData) => {
    
    const updated = [analysis, ...analysisHistory].slice(0, 10); // Keep last 10 analyses
    setAnalysisHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    setAnalysisHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    analysisHistory,
    saveAnalysis,
    clearHistory,
  };
}; 