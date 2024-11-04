"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnalysisResults from "@/components/AnalysisResults";

// Define the form data type
type FormInputs = {
  patentId: string;
  companyName: string;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);
    try {
      // Simulate API call with setTimeout
      // const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/check-infringement", data);
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Replace this with actual API call when ready
      // const res = {
      //   analysis_id: "51c8cab8-2ebb-403f-8b43-4b02856c4507",
      //   patent_id: "US-RE49889-E1",
      //   company_name: "Walmart Inc.",
      //   analysis_date: "2024-11-04",
      //   top_infringing_products: [
      //     {
      //       product_name: "Walmart Grocery",
      //       infringement_likelihood: "High",
      //       relevant_claims: ["1", "2", "5", "11"],
      //       explanation:
      //         "Walmart Grocery likely infringes on the claims as it involves presenting advertisements for products, allowing users to select items and add them to a shopping list, and transmitting tracking information related to those selections. The app's core functionality aligns closely with the claims described.",
      //       specific_features: [
      //         "Integration of digital ads in the app",
      //         "Ability to open shopping lists",
      //         "Adding store identification and product selection functionalities",
      //       ],
      //     },
      //     {
      //       product_name: "Quick Add from Ads",
      //       infringement_likelihood: "High",
      //       relevant_claims: ["1", "6", "14", "20"],
      //       explanation:
      //         "Quick Add from Ads appears to directly copy the functionalities outlined in the patent claims, particularly in terms of presenting advertisements, receiving selections, and incorporating those into shopping lists. The features and functions are consistent with the methods described in the patent.",
      //       specific_features: [
      //         "Display of advertisements",
      //         "Option to add products to shopping list",
      //         "Routing to shopping list after user interaction",
      //       ],
      //     },
      //   ],
      //   overall_risk_assessment:
      //     "There is a significant risk of patent infringement by both products due to their functionalities mirroring several claims outlined in the patent, particularly around digital advertisement engagement and shopping list integration.",
      // };
      const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/check-infringement", data);
      
      setAnalysisData(res.data);
    } catch (error) {
      console.error('Error:', error);
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
