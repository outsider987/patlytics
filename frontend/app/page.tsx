"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnalysisResults from "@/components/AnalysisResults";
import { useCheckInfringementAPI } from "./api/check-infringement";

// Define the form data type
type FormInputs = {
  patentId: string;
  companyName: string;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const api = useCheckInfringementAPI();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);
    try {
      // Simulate API call with setTimeout
      // await new Promise(resolve => setTimeout(resolve, 2000));

      const res = await api.POST_CHECK_INFRINGEMENT(data);

      setAnalysisData(res.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen m-auto overflow-hidden items-center max-w-[1920px] justify-center w-full bg-black">
      <div className="flex flex-col items-center justify-center w-full h-full m-auto p-6">
        {!isLoading && !analysisData && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full max-w-md p-6"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="patentId" className="text-white">
                Patent ID
              </label>
              <input
                id="patentId"
                {...register("patentId", { required: "Patent ID is required" })}
                placeholder="Patent ID"
                className="p-2 rounded text-black"
              />
              {errors.patentId && (
                <span className=" text-red">{errors.patentId.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
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
              />
              {errors.companyName && (
                <span className="text-red">{errors.companyName.message}</span>
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
