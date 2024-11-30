import HomeFeature from "../HomeFeature";
import ContactForm from "../ContactForm";

const features = [
  {
    title: 'Automated Scheduling & Route Optimization',
    description: 'Sippy offers a full suite of scheduling tools, including real-time route optimization, automated notifications, and live monitoring, all aimed at maximizing efficiency while minimizing environmental impact.',
    imagePosition: 'right' as const,
    image: {
      src: "/assets/images/home_feature1.jpg",
      alt: "Illustration of a map with pinned destinations, created for technicians to plan solar panel installations."
    }
  },
  {
    title: 'Localized Service Insights',
    description: 'Want to know how local factors affect service planning? Our scheduling experts are familiar with regional regulations, geographic conditions, and patterns that impact service routes.',
    imagePosition: 'left' as const,
    image: {
      src: "/assets/images/home_feature2.jpg",
      alt: "A man wearing a yellow hard hat stands in front of solar panels, showcasing renewable energy technology."
    }
  },
  {
    title: 'Your Partner in Efficient Resource Management',
    description: 'Founded on principles of efficiency and sustainability, Sippy serves organizations across multiple regions, supporting efficient service scheduling and resource management.',
    imagePosition: 'right' as const,
    image: {
      src: "/assets/images/home_feature3.jpg",
      alt: "Solar panels installed on residential rooftops in a suburban neighborhood, showcasing sustainable energy solutions."
    }
  }
];



const Home = () => {
  return (
    <main className="flex overflow-hidden flex-col bg-white">
      {/* Features Section */}
      <section className="flex flex-col items-center py-24 w-full max-md:max-w-full">
        {features.map((feature, index) => (
          <HomeFeature key={index} {...feature} />
        ))}
      </section>
      {/* Contact Section */}
      <section className="flex overflow-hidden flex-col justify-center items-center pb-24 w-full bg-white max-md:max-w-full">
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
          <ContactForm />
        </div>
      </section>
    </main>
  );
};

export default Home;