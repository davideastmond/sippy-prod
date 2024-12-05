"use client"

import React, { useState } from "react";

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setIsSubmitted(true); // Shows confirmation message
  };

  return (
    <form
      className="flex flex-col grow shrink justify-center items-center self-stretch p-8 pb-12 my-auto bg-amber-400 rounded-none min-w-[240px] w-[664px] max-md:max-w-full rounded-tr-[30px] rounded-br-[90px]"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-bold leading-none text-neutral-700">Contact Us</h2>
      <div className="flex flex-col mt-2.5 max-w-full w-[360px]">
        <div className="flex flex-col w-full">
          <label htmlFor="name" className="text-sm font-medium leading-none text-zinc-600">
            Name*
          </label>
          <input
            id="name"
            type="text"
            className="flex overflow-hidden gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base bg-white rounded-lg border border-solid shadow-sm border-zinc-300"
            placeholder="Enter your name"
            required
          />
        </div>
      </div>
      <div className="flex flex-col mt-2.5 w-full max-w-[360px]">
        <label htmlFor="email" className="text-sm font-medium leading-none text-zinc-600">
          E-mail*
        </label>
        <input
          id="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          className={`flex overflow-hidden gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base bg-white rounded-lg border border-solid shadow-sm ${
            emailError ? "border-red-500" : "border-zinc-300"
          }`}          
          placeholder="Enter your email"
          required
        />
            {emailError && (
          <span className="mt-1 text-sm text-red-700">{emailError}</span>
        )}
      </div>
      <div className="flex flex-col mt-2.5 max-w-full w-[360px]">
        <label htmlFor="phone" className="text-sm font-medium leading-none text-zinc-600">
          Phone number
        </label>
        <div className="flex overflow-hidden mt-1.5 w-full text-base bg-white rounded-lg border border-solid shadow-sm border-zinc-200">
          <div className="flex overflow-hidden justify-between items-center py-3 pr-3 pl-4 h-full whitespace-nowrap text-zinc-600">
            <span>US</span>
          </div>
          <input
            id="phone"
            type="tel"
            className="flex-1 shrink gap-2 self-start py-3 px-3.5 basis-3 min-w-[240px]"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>
      <div className="flex flex-col mt-2.5 max-w-full w-[360px]">
        <label htmlFor="message" className="text-sm font-medium leading-none text-neutral-700">
          Message*
        </label>
        <textarea
          id="message"
          className="flex overflow-hidden gap-2 items-start px-3.5 pt-2.5 pb-36 mt-1.5 w-full text-base bg-white rounded-lg border border-solid shadow-sm border-zinc-300 min-h-[182px] max-md:pb-24"
          placeholder="Enter your message"
          required
        />
      </div>
      <button
        className="flex items-start rounded-xl w-[136px]"
        type="submit"
      >
        <div className="overflow-hidden gap-3 self-stretch mt-4 py-3 pr-4 pl-4 bg-lime-600 rounded-xl shadow-sm max-md:px-5 text-xl font-semibold text-white">
          Submit
        </div>
      </button>
      {isSubmitted && (
        <p className="mt-4 text-center text-green-600 font-medium bg-white rounded-xl py-1 px-2">
          We have received your message and will contact you as soon as possible. Thank you!
        </p>
      )}
    </form>
  );
};

export default ContactForm;
