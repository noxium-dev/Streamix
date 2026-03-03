"use client";

import { useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { Input, InputProps } from "@heroui/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { cn } from "@/utils/helpers";

interface SearchInputProps extends InputProps {
  isLoading?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onChange,
  className,
  isLoading,
  placeholder = "Search...",
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Input
      ref={inputRef}
      autoComplete="off"
      className={cn(className, "w-full")}
      placeholder={placeholder}
      radius="full"
      onChange={onChange}
      classNames={{
        inputWrapper: "bg-secondary-background",
        input: "text-sm" }}
      aria-label="Search"
      type="search"
      labelPlacement="outside"
      disabled={isLoading}
      startContent={
        <div className="text-default-400 pointer-events-none flex shrink-0 items-center pr-1">
          {isLoading ? <LoadingSpinner color="default" size="sm" /> : <FaSearch />}
        </div>
      }
      {...props}
    />
  );
};

export default SearchInput;
