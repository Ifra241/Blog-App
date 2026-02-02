import React from "react";
import OtpVerificationClient from "./OtpVerificationClient";

export default function Page() {
  return (
    <React.Suspense fallback={<div />}>
      <OtpVerificationClient />
    </React.Suspense>
  );
}

