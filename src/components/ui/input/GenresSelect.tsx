"use client";

import { Select, SelectProps } from "@heroui/react";

interface GenresSelectProps extends Omit<SelectProps, "children" | "selectionMode"> {
  onGenreChange?: (genres: Set<string> | null) => void;
}

const GenresSelect: React.FC<GenresSelectProps> = (props) => {
  return null;
};

export default GenresSelect;
