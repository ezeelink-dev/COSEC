import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import iconMapping from './iconMapping'; // Ensure you have this mapping for icons

export function ComboboxDemo({ menuData }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // Filter to only last-child items for display
  const lastChildItems = (menu) => {
    const results = [];

    const traverse = (items) => {
      items.forEach(item => {
        if (item.children.length === 0) {
          results.push(item);
        } else {
          traverse(item.children);
        }
      });
    };

    traverse(menu);
    return results;
  };

  const menuItems = lastChildItems(menuData);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? menuItems.find((item) => item.MenuID === value)?.MenuName
            : "Select menu item..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search menu item..." />
          <CommandList>
            <CommandEmpty>No menu item found.</CommandEmpty>
            <CommandGroup>
              {menuItems.map((item) => (
                <CommandItem
                  key={item.MenuID}
                  value={item.MenuID}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === item.MenuID ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {item.MenuName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
