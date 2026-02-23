"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Header from "@/app/sections/Header";
import InnerPageTitle from "@/app/sections/InnerPageTitle";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type Question = {
  id: number;
  list: string;
  heading: string;
  question: string;
};

export default function SkillsChecklists() {
  const searchParams = useSearchParams();
  const lst = searchParams.get("lst") || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  const { register, handleSubmit } = useForm();



  useEffect(() => {
    axios
      .get(`https://adextravelnursing.com/api_skills_checklists.php?list=${lst}`)
      .then((res) => setQuestions(res.data))
      .finally(() => setLoading(false));
  }, [lst]);

  // 🔥 Group questions by heading
  const groupedQuestions = questions.reduce((acc: any, q) => {
    if (!acc[q.heading]) acc[q.heading] = [];
    acc[q.heading].push(q);
    return acc;
  }, {});

  const onSubmit = (data: any) => {
    console.log(data);

    axios.post("https://adextravelnursing.com/api_save_skills.php", {
      firebase_uid: user?.uid,
      list: lst,
      responses: data
    });
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <InnerPageTitle title='Skills Checklists'/>
      <div className="bg-gray-100 pt-2 pb-12">
        <section className="mt-12 max-w-5xl mx-auto md:px-8">


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 bg-white rounded-lg p-8 shadow-lg">
          <div>
            <h2 className="text-gray-800 text-3xl font-black">
              {lst} Checklist
            </h2>
            <p className='text-md text-gray-700'>This assessment is for determining your experience in the below outlined clinical areas. This checklist will not be used as a determining factor in accepting your application for employment with ADEX Medical Staffing, LLC.</p>

          </div>

          {Object.entries(groupedQuestions).map(([heading, items]: any) => (
            <div key={heading}>
              <h2 className="text-xl font-black mb-6 border-b pb-2">
                {heading}
              </h2>

              <div className="space-y-6">

                {items.map((question: Question) => (
                  <div
                    key={question.id}
                    className="flex flex-wrap justify-between gap-2 border-b pb-4"
                  >
                    <div className="font-medium w-full text-md" >
                      {question.question}
                    </div>

                    {/* Proficiency */}
                    <div>
                      <p className="text-xs font-semibold mb-2 text-gray-700">
                        Proficiency
                      </p>
                      <div className="flex gap-4 text-gray-700">
                        {[
                          { value: "none", label: "No Experience" },
                          { value: "limited", label: "Limited" },
                          { value: "proficient", label: "Proficient" },
                          { value: "expert", label: "Expert" }
                        ].map((opt) => (
                          <label key={opt.value} className="flex items-center gap-1 text-xs">
                            <input
                              type="radio"
                              value={opt.value}
                              {...register(`q_${question.id}_proficiency`)}
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Frequency */}
                    <div>
                      <p className="text-xs font-semibold mb-2 text-gray-700">
                        Frequency
                      </p>
                      <div className="flex gap-4 text-gray-700">
                        {[
                          { value: "never", label: "Never" },
                          { value: "rarely", label: "Rarely" },
                          { value: "frequent", label: "Frequent" },
                          { value: "daily", label: "Daily" }
                        ].map((opt) => (
                          <label key={opt.value} className="flex items-center gap-1 text-xs">
                            <input
                              type="radio"
                              value={opt.value}
                              {...register(`q_${question.id}_frequency`)}
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}

              </div>
            </div>
          ))}

          <div className="pt-8">
            <button
              type="submit"
              className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-700 transition"
            >
              Submit Checklist
            </button>
          </div>

        </form>
        </section>
      </div>
    </div>

  );
}