"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

// Define the form data type
type FormInputs = {
  patentId: string;
  companyName: string;
};

export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    console.log(data); // Handle form submission here
  };

  return (
    <main className="flex flex-col min-h-screen m-auto overflow-hidden items-center max-w-[1920px] justify-center w-full bg-black">
      <div className="flex flex-col items-center justify-center w-full h-full m-auto">
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
              <span className="text-red-500">{errors.patentId.message}</span>
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
              <span className="text-red-500">{errors.companyName.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
