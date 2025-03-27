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

export type CategoryType = {
  value: string;
  label: string;
};

interface CategorySelectorProps {
  selectedCategoryValue: string;
  categories: CategoryType[];
  addCategoryAction: (newCategoryVal: string) => void;
  onChangeAction: (categoryVal: string) => void;
  id?: string;
}

export function CategorySelector({
  selectedCategoryValue,
  categories,
  addCategoryAction,
  onChangeAction,
  id,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (
      newCategory.trim() &&
      !categories.some((c) => c.value === newCategory.toLowerCase())
    ) {
      addCategoryAction(newCategory);
      onChangeAction(newCategory.toLowerCase());
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
          id={id}
        >
          {selectedCategoryValue
            ? categories.find(
                (category) => category.value === selectedCategoryValue
              )?.label
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
                  onChangeAction(category.value); // Update form value
                  setOpen(false);
                }}
                className="font-alumni"
                data-testid={`category-${category.label.toLowerCase()}`}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    selectedCategoryValue === category.value
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                  data-testid="check-icon"
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
