type SpecificProduct = {
  product_name: string;
  infringement_likelihood: string;
  relevant_claims: string[];
  explanation: string;
  specific_features: string[];
};

type AnalysisData = {
  analysis_id: string;
  patent_id: string;
  company_name: string;
  analysis_date: string;
  top_infringing_products: SpecificProduct[];
  overall_risk_assessment: string;
};

const AnalysisResults = ({ data }: { data: AnalysisData }) => {
  return (
    <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg text-white pt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400">Analysis ID</p>
            <p>{data.analysis_id}</p>
          </div>
          <div>
            <p className="text-gray-400">Patent ID</p>
            <p>{data.patent_id}</p>
          </div>
          <div>
            <p className="text-gray-400">Company Name</p>
            <p>{data.company_name}</p>
          </div>
          <div>
            <p className="text-gray-400">Analysis Date</p>
            <p>{data.analysis_date}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Top Infringing Products</h3>
        <div className="space-y-6">
          {data.top_infringing_products.map((product, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-medium">{product.product_name}</h4>
                <span className={`px-3 py-1 rounded ${
                  product.infringement_likelihood === "High" 
                    ? "bg-red-500" 
                    : product.infringement_likelihood === "Medium"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}>
                  {product.infringement_likelihood}
                </span>
              </div>
              <p className="text-gray-300 mb-2">Relevant Claims: {product.relevant_claims.join(", ")}</p>
              <p className="text-gray-300 mb-2">{product.explanation}</p>
              <div>
                <p className="font-medium mb-1">Specific Features:</p>
                <ul className="list-disc list-inside text-gray-300">
                  {product.specific_features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Overall Risk Assessment</h3>
        <p className="text-gray-300">{data.overall_risk_assessment}</p>
      </div>
    </div>
  );
};

export default AnalysisResults; 