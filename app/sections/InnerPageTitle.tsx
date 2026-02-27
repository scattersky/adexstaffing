'use client'
import {useSearchParams} from "next/navigation";

type Props = {
  title: string;
  subHeading: string;
};
export default function InnerPageTitle({ title, subHeading }: Props) {
  const searchParams = useSearchParams();
  const lst = searchParams.get("lst") || "";

  return (
    <div className="relative flex flex-col lg:flex-col-reverse py-0 md:py-4 lg:pt-0 lg:pb-0" >
      <div className="inset-y-0 top-0 right-0 z-0 w-full px-0 mx-auto md:px-0 lg:pr-0 lg:mb-0 lg:mx-0 lg:w-7/12 lg:max-w-full lg:absolute xl:px-0">
        <svg
          className="absolute left-0 hidden h-full text-white transform -translate-x-1/2 lg:block"
          viewBox="0 0 100 100"
          fill="currentColor"
          preserveAspectRatio="none slice"
        >
          <path d="M50 0H100L50 100H0L50 0Z" />
        </svg>
        <img
          className="object-cover w-full h-36  shadow-lg  lg:shadow-none md:h-96 lg:h-full"
          src="/25758.jpg"
          alt=""
        />
      </div>
      <div className="relative flex flex-col items-start w-full max-w-xl px-4 mx-auto md:px-0 lg:px-8 lg:max-w-screen-xl">
        <div className="w-full flex flex-col justify-start items-start py-4 md:py-10">
          <h1 className="relative z-10  max-w-8xl text-2xl font-bold text-neutral-800 md:text-4xl lg:text-6xl mb-0  md:mb-2 tracking-tighter">
            <span className='font-extrabold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent text-3xl md:text-3xl lg:text-5xl ' >{title}</span>
          </h1>
          <h3 className="relative z-10 text-xs md:text-sm whitespace-normal  font-normal text-neutral-800 ">
            {lst ? lst : subHeading}
          </h3>


        </div>
      </div>
    </div>

  );
}