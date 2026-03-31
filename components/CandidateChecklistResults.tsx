'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

interface Submission {
  id: number;
  list: string;
  created_at: string;
  responses_json: Record<string, string>;
}

interface Question {
  id: number;
  heading: string;
  question: string;
}

export default function CandidateChecklistResults({
                                                    candidateUid,
                                                    candidateName
                                                  }: {
  candidateUid: string;
  candidateName?: string;
}) {

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [questionsByList, setQuestionsByList] = useState<any>({});
  const [expanded, setExpanded] = useState<number | null>(null);

  // 🔥 Fetch submissions for THIS candidate
  useEffect(() => {
    if (!candidateUid) return;

    axios
      .get(`https://adextravelnursing.com/api_get_skills_submissions.php?uid=${candidateUid}`)
      .then(res => setSubmissions(res.data));
  }, [candidateUid]);

  // 🔥 Fetch checklist questions (cached per list)
  const fetchQuestions = async (list: string) => {
    if (questionsByList[list]) return;

    const res = await axios.get(
      `https://adextravelnursing.com/api_skills_checklists.php?list=${list}`
    );

    setQuestionsByList((prev: any) => ({
      ...prev,
      [list]: res.data
    }));
  };

  const toggleExpand = async (submission: Submission) => {
    if (expanded === submission.id) {
      setExpanded(null);
      return;
    }

    await fetchQuestions(submission.list);
    setExpanded(submission.id);
  };

  const groupQuestions = (questions: Question[]) => {
    return questions.reduce((acc: any, q) => {
      if (!acc[q.heading]) acc[q.heading] = [];
      acc[q.heading].push(q);
      return acc;
    }, {});
  };

  if (!submissions.length) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <p className="text-gray-500">No checklist submissions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-2xl mb-2">
        {candidateName ? `${candidateName}'s Checklists` : "Checklist Submissions"}
      </h2>

      {submissions.map((s) => {
        const questions = questionsByList[s.list] || [];
        const grouped = groupQuestions(questions);

        return (
          <div key={s.id} className="border rounded p-4 bg-white shadow">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-xl mb-1">{s.list}</p>
                <div className="flex justify-center items-center px-2 pt-1 pb-2 w-40 rounded-md bg-linear-to-br from-cyan-600 to-cyan-700 -ml-0.5 ">
                  <span className="text-white text-[11px] leading-3 mt-1  font-medium uppercase ">
                    {moment(s?.created_at).format(
                      'MMMM Do, YYYY'
                    )}

                  </span>
                </div>

              </div>

              <button
                onClick={() => toggleExpand(s)}
                className="px-3 py-1 bg-sky-800 text-white rounded text-sm"
              >
                {expanded === s.id ? "Hide" : "View"}
              </button>
            </div>

            {/* Expanded */}
            {expanded === s.id && (
              <div className="mt-4 space-y-6">
                {Object.entries(grouped).map(([heading, qs]: any) => (
                  <div key={heading}>
                    <h3 className="font-bold text-xl">
                      {heading}
                      <hr className="border-gray-700 my-2" />
                    </h3>

                    {qs.map((q: Question) => {
                      const prof =
                        s.responses_json[`q_${q.id}_proficiency`];
                      const freq =
                        s.responses_json[`q_${q.id}_frequency`];

                      return (
                        <div key={q.id} className="mb-3">
                          <p className="font-medium">{q.question}</p>

                          <div className="text-sm text-gray-600 flex gap-4">
                            <span>
                              <strong>Proficiency:</strong> {prof || "—"}
                            </span>
                            <span>
                              <strong>Frequency:</strong> {freq || "—"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}