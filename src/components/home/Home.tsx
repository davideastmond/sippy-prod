import HomeFeature from "./sections/HomeFeature";
import Testimonials from "./sections/Testimonials";
import Hero from "./sections/Hero";
import Analytics from "./sections/Analytics";
import AboutSection from "./sections/AboutSection";
import CompanyShowcase from "./sections/Companies";
import Footer from "../global/Footer";

const features = [
  {
    title: "Automated Scheduling & Route Optimization",
    description:
      "Sippy offers a full suite of scheduling tools, including real-time route optimization, automated notifications, and live monitoring, all aimed at maximizing efficiency while minimizing environmental impact.",
    imagePosition: "right" as const,
    image: {
      src: "/assets/images/home_feature1.jpg",
      alt: "Illustration of a map with pinned destinations, created for technicians to plan solar panel installations.",
    },
  },
  {
    title: "Localized Service Insights",
    description:
      "Want to know how local factors affect service planning? Our scheduling experts are familiar with regional regulations, geographic conditions, and patterns that impact service routes.",
    imagePosition: "left" as const,
    image: {
      src: "/assets/images/home_feature2.jpg",
      alt: "A man wearing a yellow hard hat stands in front of solar panels, showcasing renewable energy technology.",
    },
  },
  {
    title: "Your Partner in Efficient Resource Management",
    description:
      "Founded on principles of efficiency and sustainability, Sippy serves organizations across multiple regions, supporting efficient service scheduling and resource management.",
    imagePosition: "right" as const,
    image: {
      src: "/assets/images/home_feature3.jpg",
      alt: "Solar panels installed on residential rooftops in a suburban neighborhood, showcasing sustainable energy solutions.",
    },
  },
];

const Home = () => {
  return (
    <main className="flex overflow-hidden flex-col bg-white">
      {/* Hero Section */}
      <section>
        <Hero />
        <CompanyShowcase />
      </section>
      {/* About Section */}
      <section>
        <AboutSection />
      </section>
      {/* Analytics Section */}
      <section className="relative">
        <Analytics />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2/3 bg-white px-8 py-6 rounded-xl w-1/2 flex flex-col items-center max-md:relative max-md:translate-y-0 max-md:w-full max-md:px-6 max-md:py-4">
          <h2 className="text-3xl font-bold leading-10 text-neutral-700 text-center mb-4">
            Tell us your goals to save money and energy.
          </h2>
          <button className="mt-4 overflow-hidden py-3.5 px-6 bg-lime-600 rounded-xl shadow-sm text-2xl font-semibold text-white">
            Make your appointment now
          </button>
        </div>
      </section>
      {/* Features Section */}
      <section className="flex flex-col items-center py-24 w-full max-md:max-w-full">
        {features.map((feature, index) => (
          <HomeFeature key={index} {...feature} />
        ))}
      </section>
      {/* Testimonials Section */}
      <section>
        <Testimonials />
      </section>
      <Footer />
    </main>
  );
};

export default Home;
