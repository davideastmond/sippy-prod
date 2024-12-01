const testimonialContent = `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`;

const Testimonials = () => {
    return (
      <div className="flex overflow-hidden flex-col justify-center pb-24 w-full bg-white">
        <h2 className="w-full text-3xl font-bold leading-none text-center text-neutral-700">
          Hear from satisfied{" "}
          <span className="text-lime-600">clients in their own words</span>
        </h2>
        <div className="lg:flex relative gap-10 items-start self-center p-8 max-w-full w-[1280px]">
          <div className="lg:overflow-hidden lg:self-stretch lg:pt-8 lg:pb-8 lg:pr-32 lg:pb-3 lg:pl-7 lg:my-auto text-lg leading-7 text-white lg:rounded-3xl lg:bg-neutral-700 lg:min-h-[464px] lg:min-w-[240px] lg:w-[668px] hidden lg:block">
            {testimonialContent}
          </div>
          <div className="lg:flex lg:overflow-hidden lg:absolute lg:right-8 lg:top-2/4 lg:z-0 lg:items-center bg-amber-400 lg:rounded-3xl lg:-translate-y-2/4 lg:min-w-[240px] lg:translate-x-[0%] lg:w-[608px] lg:h-[299px] hidden lg:block">
            <img 
              src="/assets/images/testimonial.jpg" 
              alt="Client testimonial" 
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
          <div className="lg:hidden flex flex-col gap-6">
            <div className="overflow-hidden bg-amber-400 rounded-3xl w-full h-[250px]">
              <img 
                src="/assets/images/testimonial.jpg" 
                alt="Client testimonial" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden pt-8 px-6 pb-8 rounded-3xl bg-neutral-700 min-h-[300px] text-white">
              {testimonialContent}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Testimonials