"use client";
import { Input } from "@nextui-org/input";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchComponent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, 300);

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  };

  return (
    <Input
      size="lg"
      isClearable
      onClear={handleClear}
      placeholder="Buscar..."
      startContent={<SearchOutlinedIcon />}
      className="w-full px-4"
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
      defaultValue={searchParams.get("query")?.toString()}
    ></Input>
  );
}
