import getConfig from "next/config";
import Image from "next/image";
const { publicRuntimeConfig } = getConfig();
const Footer = () => {
  return (
    <footer className="bg-simmpy-gray-600 text-simmpy-gray-100 font-montserrat">
      <div className="py-12 px-4 md:px-16 lg:px-32 flex flex-col md:flex-row justify-between items-center md:items-start gap-y-6 md:gap-16 text-center md:text-left">
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-4">
            <Image
              src="/assets/images/icons/sippy_nav.jpg"
              alt="Sippy Logo"
              width={32}
              height={32}
              className="mr-2"
            />
            <h1 className="text-simmpy-green text-xl font-bold">Sippy</h1>
          </div>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">
            Design amazing digital experiences that create more happy in the
            world.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-4">GET IN TOUCH</h2>
          <ul>
            <li className="mb-2">COMMERCIAL SOLAR INFORMATION</li>
            <li>
              <a
                href="#"
                className="text-simmpy-green underline hover:no-underline"
              >
                commercial solar information
              </a>
            </li>
          </ul>
        </div>

        <div>
          <ul className="space-y-2">
            <li>GETTING START WITH SOLAR</li>
            <li>SITEMAP</li>
            <li>PRIVACY POLICY</li>
            <li>
              <a
                href="#"
                className="text-simmpy-gray-100 font-bold hover:text-simmpy-green"
              >
                BACK TO TOP
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white text-simmpy-gray-600 py-4 px-4 md:px-16 lg:px-32 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          &copy; Sippy 2024. All rights reserved.{" "}
          <span className="text-[#19a30d]">
            v.{publicRuntimeConfig?.version}
          </span>
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#">
            <Image
              src="/assets/images/icons/linkedin.svg"
              alt="LinkedIn"
              width={24}
              height={24}
            />
          </a>
          <a href="#">
            <Image
              src="/assets/images/icons/facebook.svg"
              alt="Facebook"
              width={24}
              height={24}
            />
          </a>
          <a href="#">
            <Image
              src="/assets/images/icons/github2.svg"
              alt="GitHub"
              width={24}
              height={24}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
