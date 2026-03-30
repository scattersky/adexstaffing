import Image from "next/image";
import {BsFillTelephoneFill} from "react-icons/bs";
import {BiSolidEnvelope} from "react-icons/bi";
import {RxLinkedinLogo} from "react-icons/rx";
import {FaMapMarkerAlt} from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="bg-gray-800 pt-8">
      <div className="container p-6 mx-auto">
        <div className="lg:flex">
          <div className="w-full -mx-6 lg:w-2/5">
            <div className="px-6">
              <a href="#">
                <Image src="/adexwhite.png" alt="logo" width={200} height={100} className=''/>
              </a>

              <p className="max-w-sm mt-2 text-gray-300">Join 31,000+ other and never miss out on new
                tips, tutorials, and more.</p>

              <div className="flex mt-6 -mx-2">
                <a href="https://www.linkedin.com/company/adex-healtcare-staffing-llc"
                   className="mx-2 transition-colors duration-300 text-gray-300"
                   aria-label="LinkedIn"
                  target="_blank">
                  <RxLinkedinLogo  color="#e4e4e7" size={24}/>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 lg:mt-0 lg:flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">


              <div>
                <h3 className="uppercase text-gray-300">WHO WE HIRE</h3>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">RNs</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">Allied Healthcare Pros</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">Requirements</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">Specialties & Shifts</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">Getting Started</a>
              </div>

              <div>
                <h3 className="uppercase text-gray-300">WHY WORK HERE</h3>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">Made For You</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">All-In-One</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">Benefits</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">Housing</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">Credentials</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">Testimonials</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline"> Travel Nursing</a>
              </div>

              <div>
                <h3 className="uppercase text-gray-300">RESOURCES</h3>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">State Licensing</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">FAQs</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">Industry Links</a>
                <a href="#" target="_blank" className="block mt-2 text-sm text-gray-300 hover:underline">Forms & Documents</a>
              </div>

              <div>
                <h3 className="uppercase text-gray-300">CONTACT</h3>
                <a href="tel:+18139722339" target="_blank" className=" mt-2 text-sm text-gray-300 flex flex-nowrap items-center gap-1">
                  <BsFillTelephoneFill size={18} className='text-red-500'/>
                  <span className='block text-sm text-gray-300'>813-972-2339</span>
                </a>
                <a href="mailto:medjobs@adexhc.com" target="_blank" className=" mt-2 text-sm text-gray-300 flex flex-nowrap items-center gap-1">
                  <BiSolidEnvelope size={18} className='text-red-500'/>
                  <span className='block text-sm text-gray-300'>medjobs@adexhc.com</span>
                </a>
                <a href="mailto:medjobs@adexhc.com" target="_blank" className=" mt-2 text-sm text-gray-300 flex flex-nowrap items-center gap-1">
                  <FaMapMarkerAlt size={18} className='text-red-500'/>
                  <span className='block text-sm text-gray-300'>Tampa</span>
                </a>
                <a href="mailto:medjobs@adexhc.com" target="_blank" className=" mt-2 text-sm text-gray-300 flex flex-nowrap items-center gap-1">
                  <FaMapMarkerAlt size={18} className='text-red-500'/>
                  <span className='block text-sm text-gray-300'>Pittsburgh</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="h-px my-6 text-gray-400 border-none bg-gray-600 "/>

        <div>
          <p className="text-center text-[11px] text-gray-300">© ADEX Healthcare Staffing 2026 - All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
