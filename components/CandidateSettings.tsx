'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import EmailNotificationToggle from "@/components/EmailNotificationToggle";
import CandidateProfileEdit from "@/components/CandidateProfileEdit";
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

interface UserProfile {
  id: number;
  firebase_uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialty: string;
  years_experience: string;
}


export default function CandidateSettings() {
  const { user, role, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0); // first tab active by default
  useEffect(() => {
    if (!user) return;

    axios
      .get("https://adextravelnursing.com/api_get_user.php", {
        params: { uid: user.uid }
      })
      .then((response) => {
        setUserData(response.data);

      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);


  return (
    <TabGroup index={activeTabIndex} onIndexChange={setActiveTabIndex} className="mt-2">
      <TabList className='mb-6'>
        <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 0 ? 'bg-sky-900 text-white' : ''}`}>Edit Profile</Tab>
        <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 1 ? 'bg-sky-900  text-white' : ''}`}>Notifications</Tab>
        <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 2 ? 'bg-sky-900  text-white' : ''}`}>Security</Tab>
      </TabList>

      <TabPanels>

        <TabPanel>
          <CandidateProfileEdit/>
        </TabPanel>
        <TabPanel>
          <EmailNotificationToggle />
        </TabPanel>
        <TabPanel>
          <Link href="/resetpassword" className="bg-red-700 px-4 py-2 rounded-md max-w-40 text-center">
            <span className="text-sm font-medium text-white">Reset Password</span>
          </Link>
        </TabPanel>
      </TabPanels>
    </TabGroup>

  );
}