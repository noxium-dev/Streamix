import React, { Suspense } from "react";

import { Spinner } from "@heroui/react";

const DiscoverListGroup = React.lazy(() => import("@/components/sections/Discover/ListGroup"));

const DiscoverPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Spinner size="lg" color="primary" /></div>}>
      <DiscoverListGroup />
    </Suspense>
  );
};

export default DiscoverPage;
