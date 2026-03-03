import { Link } from "react-router-dom";
import { Button } from "@heroui/react";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-6xl font-black text-primary">404</h1>
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="max-w-md text-default-500">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button as={Link} to="/" color="primary" size="lg" className="font-bold">
        Back to Home
      </Button>
    </div>
  );
};

export default NotFound;
