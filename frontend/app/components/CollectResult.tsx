import { useAnalysisStorage } from '../hooks/useAnalysisStorage';
import { useState } from 'react';
import Modal from './Modal';
import AnalysisResults from './AnalysisResults';

const CollectResult = () => {
  const { analysisHistory, clearHistory } = useAnalysisStorage();
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);

  const handleClose = () => {
    setSelectedAnalysis(null);
  };

  return (
    <>
      <div className="fixed right-0 top-0 h-full w-64 bg-gray-900 bg-opacity-50 p-4 overflow-y-auto z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-semibold">History</h3>
          <button
            onClick={clearHistory}
            className="text-sm text-gray-400 hover:text-white"
          >
            Clear All
          </button>
        </div>
        <div className="space-y-3">
          {analysisHistory.map((analysis) => (
            <div
              key={analysis.analysis_id}
              className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700"
              onClick={() => setSelectedAnalysis(analysis)}
            >
              <p className="text-white font-medium truncate">
                {analysis.company_name}
              </p>
              <p className="text-gray-400 text-sm truncate">
                Patent: {analysis.patent_id}
              </p>
              <p className="text-gray-400 text-sm">
                {new Date(analysis.analysis_date).toLocaleDateString()}
              </p>
              <div className="mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    analysis.top_infringing_products[0]?.infringement_likelihood === "High"
                      ? "bg-red-500"
                      : analysis.top_infringing_products[0]?.infringement_likelihood === "Medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {analysis.top_infringing_products[0]?.infringement_likelihood || "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        show={selectedAnalysis !== null}
        onClose={handleClose}
        size="xl"
        title="Analysis Details"
      >
        {selectedAnalysis && (
          <AnalysisResults className="h-full" data={selectedAnalysis} />
        )}
      </Modal>
    </>
  );
};

export default CollectResult;
