"use client";

import React, { useState } from "react";

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "", phone: "" });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email" && emailError) {
      setEmailError(""); // Clear email error when the user updates the email
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "", phone: "" }); // Reset form
      } else {
        console.error("Failed to send email:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex overflow-hidden flex-col justify-center items-center pb-24 w-full bg-white max-md:max-w-full pt-10">
      <div className="flex flex-wrap gap-8 items-center pl-8 max-w-full w-[1280px] max-md:px-5">
        <div className="flex flex-col grow shrink self-stretch my-auto min-w-[240px] w-[368px] max-md:max-w-full">
          <h2 className="text-3xl font-bold text-neutral-700">
            Start Your Solar Journey
            <span className="block font-extrabold text-lime-600">TODAY</span>
          </h2>
          <p className="mt-4 text-lg leading-loose text-zinc-600">
            Take the first step toward clean, renewable energy
          </p>
        </div>
        <form
          className="flex flex-col grow shrink justify-center items-center self-stretch p-8 pb-12 my-auto bg-amber-400 rounded-none min-w-[240px] w-[664px] max-md:max-w-full rounded-tr-[30px] rounded-br-[90px]"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold leading-none text-neutral-700">
            Contact Us
          </h2>
          <div className="flex flex-col mt-2.5 max-w-full w-[360px]">
            <div className="flex flex-col w-full">
              <label htmlFor="name" className="text-sm font-medium leading-none text-zinc-600">
                Name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
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
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
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
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="flex overflow-hidden gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base bg-white rounded-lg border border-solid shadow-sm border-zinc-300"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="flex flex-col mt-2.5 max-w-full w-[360px]">
            <label htmlFor="message" className="text-sm font-medium leading-none text-neutral-700">
              Message*
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
              className="flex overflow-hidden gap-2 items-start px-3.5 pt-2.5 pb-36 mt-1.5 w-full text-base bg-white rounded-lg border border-solid shadow-sm border-zinc-300 min-h-[182px] max-md:pb-24"
              placeholder="Enter your message"
              required
            />
          </div>
          <button
            className="flex items-start rounded-xl w-[136px]"
            type="submit"
            disabled={loading}
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
      </div>
    </section>
  );
};

export default ContactForm;
