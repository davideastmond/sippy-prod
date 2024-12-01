const Analytics = () => {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-white">
      {/* Left side: Text content */}
      <div className="flex flex-col justify-center px-10 py-8 text-2xl text-white bg-neutral-700 md:w-1/2 md:px-20 md:py-16">
        <div className="flex flex-col">
          <h1
            className="font-bold tracking-tighter leading-10 text-3xl md:text-5xl lg:text-6xl"
          >
            Analytics that feels like it's from the future
          </h1>
          <h2
            className="mt-2.5 font-light tracking-tighter leading-none uppercase text-3xl md:text-5xl lg:text-6xl"
          >
            with Sippy
          </h2>
          <p className="mt-2.5 text-lg leading-8">
            We don't just help you schedule visits. We empower your team to
            efficiently manage resident requests, integrate route optimization,
            and utilize data to create a responsive and effective service
            system. With Sippy, you can expect a reliable and scalable approach
            to scheduling that grows with your needs.
          </p>
          <p className="mt-2.5 text-lg leading-8">
            Our goal is to provide organizations with intuitive scheduling
            solutions that reduce operational costs while enhancing user
            experience. Sippy is designed to give your team a competitive edge
            with energy-efficient, time-saving service planning, aligning with
            sustainability goals and promoting an eco-friendly future.
          </p>
        </div>
      </div>
      {/* Right side: Image */}
      <div className="flex md:w-1/2">
        <img
          src="/assets/images/analytics.jpg"
          alt="A rooftop with solar panels with a background of a blue sky"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Analytics;
