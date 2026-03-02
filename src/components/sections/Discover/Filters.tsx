import ContentTypeSelection from "@/components/ui/other/ContentTypeSelection";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { Select, SelectItem, Button } from "@heroui/react";

const DiscoverFilters = () => {
  const { types, content, queryType, setQueryType, resetFilters } =
    useDiscoverFilters();

  return (
    <div className="flex w-full flex-wrap justify-center gap-3">
      <ContentTypeSelection className="mb-5 justify-center" />
      <div className="flex w-full flex-wrap justify-center gap-3">
        <Select
          disallowEmptySelection
          selectionMode="single"
          size="sm"
          label="Type"
          placeholder="Select type"
          className="max-w-xs"
          selectedKeys={[queryType]}
          onChange={({ target }) => {
            setQueryType(target.value as any);
          }}
          value={queryType}
        >
          {types.map(({ name, key }) => {
            return <SelectItem key={key}>{name}</SelectItem>;
          })}
        </Select>
      </div>
      <Button size="sm" onPress={resetFilters}>
        Reset Filters
      </Button>
    </div>
  );
};

export default DiscoverFilters;
