import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import {RiFolderAddLine} from "react-icons/ri";

export function SaveJobButton({ jobId }: { jobId: string }) {
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) return alert("Please log in first.");
    try {
      await axios.post("https://adextravelnursing.com/api_save_job.php", {
        firebase_uid: user.uid,
        job_id: jobId
      });
      alert("Job saved!");
    } catch (e) {
      console.error(e);
      alert("Failed to save job.");
    }
  };

  return (
    <button
      onClick={handleSave}
      className='flex items-center justify-center gap-1 text-center px-4 py-2 border border-sky-800 hover:border-sky-700  rounded-md hover:bg-sky-700 bg-sky-800 transition cursor-pointer text-[13px] duration-700'>
      <RiFolderAddLine color="white" size={16} />
      <span className="flex items-center text-white text-xs">Save To My Jobs</span>
    </button>

  );
}