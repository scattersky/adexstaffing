'use client';

import { Suspense } from 'react';
import ResetPasswordPage from "@/components/ResetPasswordPage";


export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading reset page...</p>}>
      <ResetPasswordPage />
    </Suspense>
  );
}