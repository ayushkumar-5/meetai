import { ReactNode, useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";

interface Props {
  options: Array<{
    id: string;
    value: string;
    searchValue?: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  isSearchable = true,
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Button
    onClick={()=>setOpen(true)}
    type="button"
variant="outline"
className={cn(
"h-9 justify-between font-normal px-2",
!selectedOption && "text-muted-foreground",
className,
)}
>
      <div className="flex items-center gap-2">
        {selectedOption?.children ?? placeholder}
      </div>
      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
        <div className="p-0">
          {isSearchable && (
            <CommandInput
              placeholder="Search..."
              onValueChange={onSearch}
              autoFocus
            />
          )}
          <CommandList>
            {options.length === 0 ? (
              <CommandEmpty>No options found.</CommandEmpty>
            ) : (
              options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={[option.value, option.searchValue].filter(Boolean).join(" ")}
                  onSelect={() => {
                    onSelect(option.value);
                    setOpen(false);
                  }}
                  onClick={() => {
                    onSelect(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "cursor-pointer flex items-center gap-x-2 py-1 px-3 text-[13px]",
                    value === option.value && "bg-muted"
                  )}
                >
                  <div className="flex items-center gap-x-2">
                    {option.children}
                  </div>
                </CommandItem>
              ))
            )}
          </CommandList>
        </div>
      </CommandResponsiveDialog>
    </Button>
  );
};
