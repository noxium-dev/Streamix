import React, { Suspense } from "react";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

const SearchList = React.lazy(() => import("@/components/sections/Search/List"));

const SearchPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><LoadingSpinner size="lg" /></div>}>
      <SearchList />
    </Suspense>
  );
};

export default SearchPage;
