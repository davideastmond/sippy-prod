import Image from "next/image";

const AboutSection = () => {
  return (
    <main className="flex overflow-hidden gap-2.5 justify-center items-center px-2.5 w-full min-h-[550px] max-md:max-w-full">
      <section className="flex flex-wrap md:gap-10 items-center self-stretch px-8 my-auto min-w-[240px] w-[1280px] max-md:px-5">
        <section className="flex grow shrink gap-2.5 justify-center items-center self-stretch py-20 my-auto min-w-[240px] w-[479px] max-md:max-w-full">
          <div className="flex overflow-hidden gap-2.5 items-center self-stretch my-auto bg-amber-400 min-w-[240px] rounded-[30px] w-[487px]">
            <div className="relative min-h-[342px] min-w-[240px] w-[487px] flex self-stretch my-auto">
              <Image
                src="/assets/images/about_section.jpg"
                alt="The Agile Suncrew Team"
                className="object-cover rounded-none"
                fill
              />
            </div>
          </div>
        </section>

        <article className="flex flex-col grow shrink self-stretch my-auto text-base min-h-[342px] min-w-[240px] w-[427px] max-md:max-w-full">
          <div className="flex items-start max-w-full font-semibold text-amber-400 rounded-lg w-[100px]">
            <span className="overflow-hidden gap-2 self-stretch px-5 py-2.5 rounded-lg border border-amber-400 border-solid shadow-sm min-w-[140px] text-center">
              About Sippy
            </span>
          </div>
          <p className="flex-wrap flex-1 shrink gap-2.5 mt-8 w-full min-h-[156px] text-neutral-700 max-md:max-w-full">
            Our team, THE AGILE SUNCREW, is dedicated to helping you optimize
            your scheduling needs, enhance communication, and support
            sustainable operational practices. With expertise spanning multiple
            time zones and areas of development, we bring our collective
            experience to ensure your project&apos;s success.
          </p>
        </article>
      </section>
    </main>
  );
};

export default AboutSection;
