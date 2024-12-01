import * as React from "react";

const Hero = () => {
  return (
    <section className="flex flex-col justify-center items-center py-24 w-full min-h-[648px] max-md:max-w-full">
      <div className="flex flex-wrap gap-8 justify-center items-start px-8 max-w-full w-[1280px] max-md:px-5">
        <div className="flex flex-col flex-1 shrink items-start basis-0 min-w-[240px] max-md:max-w-full">
        <div className="flex flex-col max-w-full w-[816px]">
      <h1 className="text-6xl font-semibold tracking-tighter text-neutral-700 leading-[72px] max-md:max-w-full max-md:text-4xl max-md:leading-[53px]">
        <span className="font-bold">
        Empowering a Greener Future with {" "}
        </span>
        <span className="font-bold text-lime-600">Sippy</span>
      </h1>
      <p className="mt-6 text-xl leading-8 text-gray-600 max-md:max-w-full">
      Reliable, cost-effective, and sustainable energy solutions for homes and businesses.
      </p>
    </div>
          <div className="mt-12 max-w-full w-[136px] max-md:mt-10">
          <button
      className="flex items-start rounded-xl w-[136px]"
    >
      <div className="overflow-hidden gap-3 self-stretch py-3.5 pr-6 pl-6 bg-lime-600 rounded-xl shadow-sm max-md:px-5 text-2xl font-semibold text-white">
        Sign up
      </div>
    </button>
          </div>
        </div>
        <img
          loading="lazy"
          src="/assets/images/hero_image.webp"
          alt="Sippy logo"
          className="object-contain aspect-[1.05] min-w-[240px] w-[483px] max-md:max-w-full"
        />
      </div>
    </section>
  );
};

export default Hero