// This component can be used for both sign up and sign in pages.
"use client";
// https://github.com/free-icons/free-icons

import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import reviews from "@/lib/data/SignInReviews.json";

export default function AuthProviderSignIn() {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 7000); // Change review every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("An error occurred while signing in: ", error);
    }
  };

  return (
    <div
      className="flex flex-col-reverse md:flex-row"
      style={{ minHeight: "calc(100vh - 72px)" }} // screen minus navbar
    >
      <div className="w-full md:w-1/2 bg-white flex flex-col relative  mb-4">
        <div className="flex flex-col justify-center items-center flex-grow text-center px-4 md:px-16 mt-12 mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Welcome
          </h1>
          <p className="text-gray-600 mb-2 md:mb-8 text-sm md:text-base">
            Sign in or sign up to request a solar panel installation.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <button
              className="flex items-center justify-center bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-2 shadow-sm hover:shadow-lg transition"
              onClick={() => handleSignIn("google")}
            >
              <Image
                src="/assets/images/icons/google.svg"
                alt="Google Icon"
                width={20}
                height={20}
              />
              <span className="ml-2 font-medium">Continue with Google</span>
            </button>
            <button
              className="flex items-center justify-center bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition"
              onClick={() => handleSignIn("github")}
            >
              <Image
                src="/assets/images/icons/github.svg"
                alt="Github Icon"
                width={20}
                height={20}
              />
              <span className="ml-2 font-medium">Continue with Github</span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-between text-gray-500 text-sm md:text-lg px-6 md:px-20">
          <span>© Sippy 2024</span>
          <span>help@sippy.com</span>
        </div>
      </div>

      <div
        className="w-full md:w-1/2 flex flex-col justify-end items-center py-12 px-8 md:px-16 relative rounded-b-[15%] md:rounded-br-none"
        style={{
          background:
            "linear-gradient(to top, #9ca3af, #f3f4f6 50%, white 100%)",
        }}
      >
        <div className="text-center max-w-md mb-10 md:mb-52">
          <p className="text-gray-700 md:text-base text-left font-semibold mb-10">
            What our users say about us:
          </p>
          <p className="italic text-lg md:text-xl text-gray-800 font-medium mb-4">
            “{reviews[currentReview].quote}”
          </p>
          <p className="text-gray-600 font-medium text-sm md:text-base">
            <strong>{reviews[currentReview].author}</strong>
            <br />
            {reviews[currentReview].position}
          </p>
        </div>
      </div>
    </div>
  );
}
