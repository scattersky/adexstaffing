'use client'
import { CometCard } from "@/components/ui/comet-card";
import Header from "@/app/sections/Header";
import InnerPageTitle from "@/app/sections/InnerPageTitle";
import moment from "moment/moment";
import {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";



export default function CheckLists() {
  const [checklistTitles, setChecklistTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    axios
      .get('https://adextravelnursing.com/api_get_checklist_name.php')
      .then((res) => setChecklistTitles(res.data))
      .finally(() => setLoading(false));
  }, []);


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
          <div>
            <h2 className="text-gray-800 text-3xl font-semibold">
              Skills Checklists For Healthcare Professionals
            </h2>
            <p className='text-md text-gray-700'>In order to help us evaluate your fit here at ADEX, we strongly encourage you to fill out the skills checklist related to your specialty.</p>
          </div>
          <div className="mt-6 space-y-2 flex flex-wrap gap-4">
            {
              checklistTitles.map((checklist: any) => (
                <div key={checklist.list} >
                  <CometCard
                    translateDepth={8}
                    rotateDepth={4}
                  >
                  <Link href={`/skills/form/${checklist.list}`} className="p-5 bg-white rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition hover:outline-red-700 hover:outline block hover:shadow-red-900">
                      { checklist.list }
                  </Link>
                  </CometCard>
                </div>
              ))
            }
          </div>
        </section>
      </div>
    </div>
  );
}