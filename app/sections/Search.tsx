
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import {FlipWords} from "@/components/ui/flip-words";


export default function Search() {
  const words = ["Registered Nurse", "Licensed Practical Nurse", "Allied Health Professional", "CMA", "Certified Nursing Assistant", "Faculty Staff", "Social Worker", "Therapist", "School-Based Healthcare Professional", "Nurse Practitioner", "Physician Assistant", "Certified Registered Nurse Anesthetist"];

  return (

    <div className="flex  items-center justify-center w-full">
      <div className="flex flex-col  items-start justify-center w-full max-w-screen-2xl bg-red-900 rounded-xl min-h-[80px]  shadow-md p-6">
        <h3 className='text-white text-lg'>Whatever Your Specialty, We Have Opportunities In</h3>
        <FlipWords words={words} className=" text-lg font-bold text-white p-0"/>
      </div>
      <div className="flex items-center justify-between w-full max-w-screen-2xl bg-white rounded-xl min-h-[80px]  shadow-md">

      </div>
    </div>

  );
}