import React, { Suspense } from "react";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

const DiscoverListGroup = React.lazy(() => import("@/components/sections/Discover/ListGroup"));

const DiscoverPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><LoadingSpinner size="lg" /></div>}>
      <DiscoverListGroup />
    </Suspense>
  );
};

export default DiscoverPage;
