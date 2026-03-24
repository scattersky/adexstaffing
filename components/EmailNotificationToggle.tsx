'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import {Slide, toast} from "react-toastify";

export default function EmailNotificationToggle() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch initial value
  useEffect(() => {
    if (!user) return;

    axios.get(`https://adextravelnursing.com/api_get_user.php?uid=${user.uid}`)
      .then(res => {
        setEnabled(res.data.email_notifications === 1);
      })
      .catch(err => console.error(err));
  }, [user]);

  const handleToggle = async () => {
    if (!user) return;
    const newValue = !enabled;
    setEnabled(newValue);
    setLoading(true);

    try {
      await axios.post("https://adextravelnursing.com/api_update_email_notifications.php", {
        firebase_uid: user.uid,
        email_notifications: newValue ? 1 : 0
      });
      toast.success('Email Notifications Enabled!',{
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
    } catch (err) {
      console.error(err);
      setEnabled(!newValue); // revert if failed
      toast.error('Email Notifications Disabled.',{
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <span className="text-md font-medium">Email Notifications</span>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 items-center cursor-pointer rounded-full transition-colors duration-300 focus:outline-none 
          ${enabled ? 'bg-red-700' : 'bg-gray-300'} 
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
            ${enabled ? 'translate-x-5' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
}