import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "@/components/ui/expandable-screen"
import {useState} from "react";
import axios from "axios";
import {ShineBorder} from "@/components/ui/shine-border";
import Link from "next/link";
import {FaPhone, FaPhoneAlt} from "react-icons/fa";
import {FaPhoneFlip} from "react-icons/fa6";

export default function ExpandableContactScreen() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });


  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "https://adextravelnursing.com/api_contact_send.php",
        form
      );
      setSuccess(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      alert("Something went wrong.");
    }
    setLoading(false);
  };


  return (
    <ExpandableScreen
      layoutId="cta-card"
      triggerRadius="100px"
      contentRadius="24px"
    >
      <ExpandableScreenTrigger>
        <button className="cursor-pointer">
          Contact Us
        </button>
      </ExpandableScreenTrigger>

      <ExpandableScreenContent className="bg-primary">
        <div className="flex h-full items-center justify-center p-8 gap-8">
          <div className="w-full max-w-1/3 p-4">
            <h2 className="text-6xl font-black text-white">
              Let’s Connect
            </h2>
            <h3 className="text-white font-normal text-2xl">
              Our team is here to support your travel healthcare journey.
            </h3>
            <p className="text-white font-normal text-sm mt-2" >
              Whether you’re ready to apply for your next assignment, have questions about travel nursing, or simply want to learn more about available opportunities, our team would love to hear from you. At ADEX, we believe every healthcare professional deserves personalized guidance and support. Reach out to our recruiters today and take the next step toward discovering new locations, new experiences, and a rewarding career in healthcare.
            </p>
            <div className='flex flex-row gap-4 mt-6'>
              <div className="flex flex-col items-start justify-start gap-1 mt-3 w-full">
                <h4 className='font-bold text-white'>Tampa Bay Area Office</h4>
                <p className='text-white text-xs font-normal'>13083 Telecom Parkway N. Temple Terrace, FL 33637</p>
                <Link href='' className='text-white text-xs font-normal flex items-center gap-1 px-6 py-2 mt-2 rounded-md bg-linear-to-br from-red-700 to-red-800 hover:bg-linear-to-br hover:from-red-600 hover:to-red-800 transition duration-500 cursor-pointer'>
                  <FaPhoneAlt color='#ffffff' size={14} />
                  <span className='tel:813-972-2339'>813-972-2339</span>
                </Link>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 mt-3 w-full">
                <h4 className='font-bold text-white'>Pittsburgh Office</h4>
                <p className='text-white text-xs font-normal'>187 Northpointe Blvd #112 Freeport, PA 16229</p>
                <Link href='' className='text-white text-xs font-normal flex items-center gap-1 px-6 py-2 mt-2 rounded-md bg-linear-to-br from-red-700 to-red-800 hover:bg-linear-to-br hover:from-red-600 hover:to-red-800 transition duration-500 cursor-pointer'>
                  <FaPhoneAlt color='#ffffff' size={14} />
                  <span className='tel:412-357-2922'>412-357-2922</span>
                </Link>
              </div>
            </div>

          </div>
          <div className="w-full max-w-1/3 p-4">

            <div className="flex flex-col items-start justify-start gap-1 bg-white rounded-lg px-6 py-8 shadow-lg w-full relative">
              <ShineBorder shineColor={["#ff0000", "#bd000f", "#440000"]} borderWidth={2}/>


              <form onSubmit={handleSubmit} className="space-y-4 w-full">

                <div className="">
                  <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form?.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                  <input
                  type="tel"
                  name="phone"
                  placeholder=""
                  required
                  value={form?.phone}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Email</label>
                  <input
                  type="email"
                  name="email"
                  placeholder=""
                  required
                  value={form?.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Message</label>
                  <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  rows={5}
                  value={form?.message}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className=" text-white px-6 py-2 rounded-md bg-linear-to-br from-red-700 to-red-800 hover:bg-linear-to-br hover:from-red-600 hover:to-red-800 transition duration-500 cursor-pointer"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>

              </form>
              {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                  Message sent successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </ExpandableScreenContent>
    </ExpandableScreen>
  )
}