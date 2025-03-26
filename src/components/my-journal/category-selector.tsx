"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useState } from "react";

const defaultCategories = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "travel", label: "Travel" },
];

export function CategorySelector() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (
      newCategory.trim() &&
      !categories.some((c) => c.value === newCategory.toLowerCase())
    ) {
      const newCat = {
        value: newCategory.toLowerCase(),
        label: newCategory.charAt(0).toUpperCase() + newCategory.slice(1),
      };
      setCategories([...categories, newCat]);
      setSelectedCategory(newCat.value);
      setNewCategory("");
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-alumni text-base"
        >
          {selectedCategory
            ? categories.find((category) => category.value === selectedCategory)
                ?.label
            : "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search or add category..."
            onValueChange={(value) => setNewCategory(value)}
          />
          <CommandEmpty className="py-2 px-4">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="font-alumni"
                onClick={handleAddCategory}
              >
                <Plus className="mr-2 h-3 w-3" />
                Add &quot;{newCategory}&quot;
              </Button>
            </div>
          </CommandEmpty>
          <CommandGroup>
            {categories.map((category) => (
              <CommandItem
                key={category.value}
                value={category.value}
                onSelect={() => {
                  setSelectedCategory(category.value);
                  setOpen(false);
                }}
                className="font-alumni"
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    selectedCategory === category.value
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
                {category.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
