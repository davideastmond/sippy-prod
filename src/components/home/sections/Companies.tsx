import Image from "next/image";

interface CompanyLogoProps {
  src: string;
  width: string;
  aspectRatio: string;
  alt: string;
}

const companies: CompanyLogoProps[] = [
  {
    src: "/assets/images/company_logo_1.png",
    width: "w-[146px]",
    aspectRatio: "aspect-[3.04]",
    alt: "Company Logo 1",
  },
  {
    src: "/assets/images/company_logo_2.png",
    width: "w-[169px]",
    aspectRatio: "aspect-[3.52]",
    alt: "Company Logo 2",
  },
  {
    src: "/assets/images/company_logo_3.png",
    width: "w-[183px]",
    aspectRatio: "aspect-[3.82]",
    alt: "Company Logo 3",
  },
  {
    src: "/assets/images/company_logo_4.png",
    width: "w-40",
    aspectRatio: "aspect-[3.33]",
    alt: "Company Logo 4",
  },
  {
    src: "/assets/images/company_logo_5.png",
    width: "w-[187px]",
    aspectRatio: "aspect-[3.89]",
    alt: "Company Logo 5",
  },
];

const CompanyShowcase = () => {
  return (
    <section
      className="flex justify-center items-center py-12 w-full bg-neutral-700 min-h-[200px] max-md:max-w-full"
      aria-labelledby="showcase-title"
    >
      <div className="flex flex-col self-stretch px-8 my-auto min-w-[240px] w-[1280px] max-md:px-5">
        <h2
          id="showcase-title"
          className="self-center text-base font-medium text-center text-white max-md:max-w-full"
        >
          Join 4,000+ companies already growing
        </h2>
        <div className="flex flex-wrap gap-10 justify-center lg:justify-between items-center mt-8 w-full max-md:max-w-full">
          {companies.map((company, index) => (
            <div
              key={index}
              className={`relative ${company.width} ${company.aspectRatio}`}
            >
              <Image
                loading="lazy"
                src={company.src}
                alt={company.alt}
                className="object-contain"
                fill
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyShowcase;
