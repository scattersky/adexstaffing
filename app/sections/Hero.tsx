
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import {FlipWords} from "@/components/ui/flip-words";


export default function Hero() {
  const words = ["Registered Nurse", "Licensed Practical Nurse", "Allied Health Professional", "CMA", "Certified Nursing Assistant", "Faculty Staff", "Social Worker", "Therapist", "School-Based Healthcare Professional", "Nurse Practitioner", "Physician Assistant", "Certified Registered Nurse Anesthetist"];

  return (
    <div className="relative flex flex-col-reverse py-16 lg:pt-0 lg:flex-col lg:pb-0">
      <div className="inset-y-0 top-0 right-0 z-0 w-full max-w-xl px-4 mx-auto md:px-0 lg:pr-0 lg:mb-0 lg:mx-0 lg:w-7/12 lg:max-w-full lg:absolute xl:px-0">
        <svg
          className="absolute left-0 hidden h-full text-white transform -translate-x-1/2 lg:block"
          viewBox="0 0 100 100"
          fill="currentColor"
          preserveAspectRatio="none slice"
        >
          <path d="M50 0H100L50 100H0L50 0Z" />
        </svg>
        <img
          className="object-cover w-full h-56 rounded shadow-lg lg:rounded-none lg:shadow-none md:h-96 lg:h-full"
          src="/hero.jpeg"
          alt=""
        />
      </div>
      <div className="relative flex flex-col items-start w-full max-w-xl px-4 mx-auto md:px-0 lg:px-8 lg:max-w-screen-xl">
        <div className="w-full flex flex-col justify-start items-start py-25">
          <h2 className="relative z-10  max-w-8xl text-2xl font-bold text-neutral-800 md:text-4xl lg:text-6xl mb-2 tracking-tighter">
            More Than Just a  <br/>Staffing Agency,  <br/>ADEX is Your <br/>
            <span className='font-extrabold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent text-2xl md:text-4xl lg:text-7xl ' > Career Partner</span>

          </h2>
          <h3 className="relative z-10 text-xl font-normal text-neutral-800 ">
            Whatever Your Specialty, We Have Opportunities <br/><FlipWords words={words} className="font-black p-0 text-2xl"/>
          </h3>


        </div>
      </div>
    </div>

  );
}