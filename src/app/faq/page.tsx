"use client";

import React, { Suspense } from "react";
import SectionTitle from "@/components/ui/other/SectionTitle";

const FAQList = React.lazy(() => import("@/components/sections/About/FAQ"));

const FaqPage = () => {
  return (
    <div className="flex flex-col gap-8 py-2 min-h-[70vh] max-w-3xl mx-auto w-full">
      <div className="flex flex-col gap-3">
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <p className="text-default-500 font-medium leading-relaxed">
          Find answers to common questions about Streamix, our streaming technology, and how to get the most out of our platform.
        </p>
      </div>

      <Suspense fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <FAQList />
      </Suspense>
    </div>
  );
};

export default FaqPage;
