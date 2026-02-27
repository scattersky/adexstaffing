'use client'

import { useState } from "react";
import axios from "axios";
import InnerPageTitle from "@/app/sections/InnerPageTitle";
import ScrollProgressBar from "@/components/ScrollProgressBar";

export default function ContactPage() {
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
        "https://adextravelnursing.com/api_contact.php",
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
    <div>
      <InnerPageTitle title='Support Contact' subHeading='Get In Touch'/>

      <div className="bg-gray-100 pt-2 pb-12">
        <section className="mt-12 max-w-4xl mx-auto md:px-8">

          <div className="flex flex-col items-start justify-start gap-1 bg-white rounded-lg p-4 shadow-lg w-full">
            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                Message sent successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

            </form>
          </div>

        </section>
      </div>
    </div>



  );
}