import React, { Suspense } from "react";

const SearchList = React.lazy(() => import("@/components/sections/Search/List"));

const SearchPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading...</div>}>
      <SearchList />
    </Suspense>
  );
};

export default SearchPage;
