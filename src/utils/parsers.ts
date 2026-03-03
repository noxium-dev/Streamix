export const parseAsSet = {
  parse(queryValue: string) {
    return new Set(queryValue.split(",").filter((item) => item !== ""));
  },
  serialize(value: Set<string>) {
    return Array.from(value)
      .filter((item) => item !== "")
      .join(",");
  },
};
