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
import {
  Button,
  Tab,
  TabGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';


export default function CheckLists() {
  const [checklistTitles, setChecklistTitles] = useState([]);
  const [checklistsRN, setChecklistsRN] = useState([]);
  const [checklistsAllied, setChecklistsAllied] = useState([]);
  const [checklistsTherapy, setChecklistsTherapy] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading]);

  const fetchChecklistsRN = async () => {
    axios
      .get('https://adextravelnursing.com/api_get_checklists_names.php?degree=RN')
      .then((res) => setChecklistsRN(res.data))
      .finally(() => setLoading(false));
  }
  const fetchChecklistsAllied = async () => {
    axios
      .get('https://adextravelnursing.com/api_get_checklists_names.php?degree=Allied Health Professional')
      .then((res) => setChecklistsAllied(res.data))
      .finally(() => setLoading(false));
  }
  const fetchChecklistsTherapy = async () => {
    axios
      .get('https://adextravelnursing.com/api_get_checklists_names.php?degree=Therapy')
      .then((res) => setChecklistsTherapy(res.data))
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    fetchChecklistsRN();
    fetchChecklistsAllied();
    fetchChecklistsTherapy();
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
      <InnerPageTitle title='Skills Checklists' subHeading=''/>

      <div className="bg-gray-100 pt-2 pb-12 min-h-screen">
        <section className="mt-12 max-w-7xl mx-auto md:px-8">
          <div>
            <h2 className="text-gray-800 text-3xl font-semibold">
              Skills Checklists For Healthcare Professionals
            </h2>
            <p className='text-md text-gray-700'>In order to help us evaluate your fit here at ADEX, we strongly encourage you to fill out the skills checklist related to your specialty.</p>
          </div>
          <TabGroup index={activeTabIndex} onIndexChange={setActiveTabIndex} className="mt-10">
            <TabList>
              <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 0 ? 'bg-red-700 text-white' : ''}`}>Allied Health Professional</Tab>
              <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 1 ? 'bg-red-700  text-white' : ''}`}>RN</Tab>
              <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 2 ? 'bg-red-700  text-white' : ''}`}>Therapy</Tab>
            </TabList>

            <TabPanels>

              <TabPanel>
                <div className="mt-6 space-y-2 flex flex-wrap gap-4">
                  {
                    checklistsAllied.map((checklist: any) => (
                      <div key={checklist.checklist_name} >
                        <CometCard
                          translateDepth={8}
                          rotateDepth={4}
                        >
                          <Link href={`/skills/form/${checklist.checklist_name}`} className="p-5 bg-white rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition hover:outline-red-700 hover:outline block hover:shadow-red-900">
                            { checklist.checklist_name }
                          </Link>
                        </CometCard>
                      </div>
                    ))
                  }
                </div>
              </TabPanel>

              <TabPanel>
                <div className="mt-6 space-y-2 flex flex-wrap gap-4">
                  {
                    checklistsRN.map((checklist: any) => (
                      <div key={checklist.checklist_name} >
                        <CometCard
                          translateDepth={8}
                          rotateDepth={4}
                        >
                          <Link href={`/skills/form/${checklist.checklist_name}`} className="p-5 bg-white rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition hover:outline-red-700 hover:outline block hover:shadow-red-900">
                            { checklist.checklist_name }
                          </Link>
                        </CometCard>
                      </div>
                    ))
                  }
                </div>
              </TabPanel>

              <TabPanel>
                <div className="mt-6 space-y-2 flex flex-wrap gap-4">
                  {
                    checklistsTherapy.map((checklist: any) => (
                      <div key={checklist.checklist_name} >
                        <CometCard
                          translateDepth={8}
                          rotateDepth={4}
                        >
                          <Link href={`/skills/form/${checklist.checklist_name}`} className="p-5 bg-white rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition hover:outline-red-700 hover:outline block hover:shadow-red-900">
                            { checklist.checklist_name }
                          </Link>
                        </CometCard>
                      </div>
                    ))
                  }
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </section>
        <section className="mt-12 max-w-7xl mx-auto md:px-8">

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