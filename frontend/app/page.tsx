"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import AnalysisResults from "@/app/components/AnalysisResults";
import { useCheckInfringementAPI } from "./api/check-infringement";
import { useDebounce } from "./hooks/useDebounce";
import { useAnalysisStorage } from "./hooks/useAnalysisStorage";
import CollectResult from "@/app/components/CollectResult";

// Define the form data type
type FormInputs = {
  patentId: string;
  companyName: string;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [companyMatches, setCompanyMatches] = useState<string[]>([]);
  const [patentMatches, setPatentMatches] = useState<string[]>([]);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showPatentSuggestions, setShowPatentSuggestions] = useState(false);

  const api = useCheckInfringementAPI();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  const companyName = watch("companyName");
  const patentId = watch("patentId");

  const { saveAnalysis } = useAnalysisStorage();

  // Debounced fuzzy search functions
  const handleCompanySearch = async (value: string) => {
    if (value.length < 2) return;
    try {
      const response = await api.GET_FUZZY_MATCH_COMPANY(value);
      setCompanyMatches(response.matches);
    } catch (error) {
      console.error("Error fetching company matches:", error);
    }
  };

  const handlePatentSearch = async (value: string) => {
    if (value.length < 2) return;
    try {
      const response = await api.GET_FUZZY_MATCH_PATENT(value);
      setPatentMatches(response.matches);
    } catch (error) {
      console.error("Error fetching patent matches:", error);
    }
  };

  const debouncedCompanySearch = useDebounce(handleCompanySearch, 300);
  const debouncedPatentSearch = useDebounce(handlePatentSearch, 300);

  // Watch for input changes
  useEffect(() => {
    if (companyName) {
      debouncedCompanySearch(companyName);
    } else {
      setCompanyMatches([]);
    }
  }, [companyName]);

  useEffect(() => {
    if (patentId) {
      debouncedPatentSearch(patentId);
    } else {
      setPatentMatches([]);
    }
  }, [patentId]);

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);
    try {
      const res = await api.POST_CHECK_INFRINGEMENT(data);
      setAnalysisData(res);
      saveAnalysis(res);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen m-auto overflow-hidden items-center max-w-[1920px] justify-center w-full bg-black">
      <CollectResult />
      <div className="flex flex-col items-center justify-center w-full h-full m-auto p-6 pr-64">
        {!isLoading && !analysisData && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full max-w-md p-6"
          >
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="patentId" className="text-white">
                Patent ID
              </label>
              <input
                id="patentId"
                {...register("patentId", { required: "Patent ID is required" })}
                placeholder="Patent ID"
                className="p-2 rounded text-black"
                onFocus={() => setShowPatentSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowPatentSuggestions(false), 200)
                }
              />
              {showPatentSuggestions && patentMatches.length > 0 && (
                <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto top-full">
                  {patentMatches.map((match, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => setValue("patentId", match)}
                    >
                      {match}
                    </li>
                  ))}
                </ul>
              )}
              {errors.patentId && (
                <span className="text-orange-500">
                  {errors.patentId.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 relative">
              <label htmlFor="companyName" className="text-white">
                Company Name
              </label>
              <input
                id="companyName"
                {...register("companyName", {
                  required: "Company name is required",
                })}
                placeholder="Company Name"
                className="p-2 rounded text-black"
                onFocus={() => setShowCompanySuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowCompanySuggestions(false), 200)
                }
              />
              {showCompanySuggestions && companyMatches.length > 0 && (
                <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto top-full">
                  {companyMatches.map((match, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => setValue("companyName", match)}
                    >
                      {match}
                    </li>
                  ))}
                </ul>
              )}
              {errors.companyName && (
                <span className="text-orange-500">
                  {errors.companyName.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded shadow-gray-500 hover:shadow-gray-600 transition-shadow duration-200"
            >
              Submit
            </button>
          </form>
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && analysisData && (
          <>
            <button
              onClick={() => setAnalysisData(null)}
              className="mb-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded z-50"
            >
              New Analysis
            </button>
            <AnalysisResults data={analysisData} />
          </>
        )}
      </div>
    </main>
  );
}
