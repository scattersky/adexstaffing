import Image from "next/image";
import Header from "@/app/sections/Header";
import Hero from "@/app/sections/Hero";
import Jobs from "@/app/sections/Jobs";


export default function Home() {
  return (
    <div className='w-full min-h-screen bg-white]'>
      <Header />
      <Hero />
      <Jobs />

    </div>
  );
}
