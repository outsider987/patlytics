"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import AnalysisResults from "@/app/components/AnalysisResults";
import { useCheckInfringementAPI } from "./api/check-infringement";
import { useDebounce } from "./hooks/useDebounce";
import { useHistory } from './store/History';
import CollectResult from "@/app/components/CollectResult";
import Button from "./components/Button";
import Input from "@/app/components/Input";

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

  const { saveAnalysis } = useHistory();

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
            <Input
              id="patentId"
              label="Patent ID"
              placeholder="Patent ID"
              register={register}
              requiredMessage="Patent ID is required"
              errors={errors}
              suggestions={patentMatches}
              setValue={setValue}
            />

            <Input
              id="companyName"
              label="Company Name"
              placeholder="Company Name"
              register={register}
              requiredMessage="Company name is required"
              errors={errors}
              suggestions={companyMatches}
              setValue={setValue}
            />

            <Button mode="primaryContained" type="submit" className="rounded">
              Submit
            </Button>
          </form>
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && analysisData && (
          <>
            <Button
              onClick={() => setAnalysisData(null)}
              className="mb-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded z-50"
            >
              New Analysis
            </Button>
            <AnalysisResults data={analysisData} />
          </>
        )}
      </div>
    </main>
  );
}
