const ContactForm = () => (
  <form className="flex flex-col grow shrink justify-center items-center self-stretch p-8 pb-12 my-auto bg-amber-400 rounded-none min-w-[240px] w-[664px] max-md:max-w-full rounded-tr-[30px] rounded-br-[90px]">
    <h2 className="text-3xl font-bold leading-none text-neutral-700">Contact Us</h2>
    <div className="flex flex-col mt-2.5 max-w-full w-[360px]">
      <div className="flex flex-col w-full">
        <label htmlFor="name" className="text-sm font-medium leading-none text-zinc-600">
          Name*
        </label>
        <input
          id="name"
          type="text"
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
        type="email"
        className="flex overflow-hidden gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base bg-white rounded-lg border border-solid shadow-sm border-zinc-300"
        placeholder="Enter your email"
        required
      />
    </div>
    <div className="flex flex-col mt-2.5 max-w-full w-[360px]">
      <label htmlFor="phone" className="text-sm font-medium leading-none text-zinc-600">
        Phone number
      </label>
      <div className="flex overflow-hidden mt-1.5 w-full text-base bg-white rounded-lg border border-solid shadow-sm border-zinc-200">
        <div className="flex overflow-hidden justify-between items-center py-3 pr-3 pl-4 h-full whitespace-nowrap text-zinc-600">
          <span>US</span>
        </div>
        <input
          id="phone"
          type="tel"
          className="flex-1 shrink gap-2 self-start py-3 px-3.5 basis-3 min-w-[240px]"
          placeholder="+1 (555) 000-0000"
        />
      </div>
    </div>
    <div className="flex flex-col mt-2.5 max-w-full w-[360px]">
      <label htmlFor="message" className="text-sm font-medium leading-none text-neutral-700">
        Message*
      </label>
      <textarea
        id="message"
        className="flex overflow-hidden gap-2 items-start px-3.5 pt-2.5 pb-36 mt-1.5 w-full text-base bg-white rounded-lg border border-solid shadow-sm border-zinc-300 min-h-[182px] max-md:pb-24"
        placeholder="Enter your message"
        required
      />
    </div>
  </form>
);

export default ContactForm