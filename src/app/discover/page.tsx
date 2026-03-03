import React, { Suspense } from "react";

const DiscoverListGroup = React.lazy(() => import("@/components/sections/Discover/ListGroup"));

const DiscoverPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading...</div>}>
      <DiscoverListGroup />
    </Suspense>
  );
};

export default DiscoverPage;
