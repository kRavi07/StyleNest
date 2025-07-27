import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FONT_FAMILY_GROUPS } from "./tools-config";

interface FontFamilySelectProps {
  onSelect?: (value: string) => void;
  onChange?: (value: string) => void;
  value?: string;
}

export function FontFamilySelect({
  onSelect,
  onChange,
  value: propValue,
}: FontFamilySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(propValue || "");

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);
    if (onSelect) onSelect(newValue);
    if (onChange) onChange(newValue);
  };

  React.useEffect(() => {
    if (propValue !== undefined) {
      setValue(propValue);
    }
  }, [propValue]);

  // ... rest of the component remains the same

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-fit px-2 justify-between"
        >
          <span className="truncate">
            {value
              ? FONT_FAMILY_GROUPS.flatMap((group) => group.options).find(
                  (option) => option.value === value
                )?.label
              : "Select font"}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Search font..." />
          <CommandEmpty>No font found.</CommandEmpty>
          {FONT_FAMILY_GROUPS.map((group, index) => (
            <React.Fragment key={group.label}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={group.label}>
                {group.options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
