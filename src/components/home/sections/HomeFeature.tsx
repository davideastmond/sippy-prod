import { HomeFeatureProps } from "@/types/home-feature";
import Image from "next/image";

const HomeFeature = ({
  title,
  description,
  imagePosition,
  image,
}: HomeFeatureProps) => {
  const content = (
    <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
      <div className="flex flex-col w-full max-md:max-w-full">
        <div className="flex flex-col w-full max-md:max-w-full">
          <h3 className="text-3xl font-bold leading-10 text-neutral-700 max-md:max-w-full">
            {title}
          </h3>
          <p className="mt-4 text-lg leading-7 text-gray-600 max-md:max-w-full">
            {description}
          </p>
        </div>
      </div>
    </div>
  );

  const imageElement = (
    <div className="relative flex flex-1 shrink self-stretch my-auto basis-0 h-[512px] min-w-[240px] w-[560px] max-w-full max-md:h-auto max-md:w-auto">
      <Image
        src={image.src}
        alt={image.alt}
        className="object-contain rounded-lg"
        loading="lazy"
        fill
      />
    </div>
  );

  return (
    <div className="flex flex-wrap gap-10 items-center px-8 mt-24 max-w-full w-[1280px] max-md:px-5 max-md:mt-10">
      <div className="flex flex-col gap-10 w-full md:hidden">
        {content}
        {imageElement}
      </div>
      <div className="hidden md:flex gap-10 w-full">
        {imagePosition === "left" ? (
          <>
            {imageElement}
            {content}
          </>
        ) : (
          <>
            {content}
            {imageElement}
          </>
        )}
      </div>
    </div>
  );
};

export default HomeFeature;
