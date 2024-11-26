import HomeFeature from "../HomeFeature";

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
    </main>
  );
};

export default Home;