import CreateBlogClient from "./CreateBlogClient";
import React from "react";

export default function Page() {
  return (
    <React.Suspense fallback={<div />}>
      <CreateBlogClient />
    </React.Suspense>
  );
}


