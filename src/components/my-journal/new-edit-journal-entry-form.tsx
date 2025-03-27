"use client";
import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CategorySelector,
  CategoryType,
} from "@/components/my-journal/category-selector";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Edit } from "lucide-react";

// Define validation schema
const journalEntrySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  content: z
    .string()
    .min(10, "Entry must be at least 10 characters")
    .max(5000, "Entry is too long"),
});

interface NewEditJournalEntryForm {
  editing: boolean;
  journalEntry?: z.infer<typeof journalEntrySchema>;
}

const defaultCategories = [
  { value: "1", label: "Personal" },
  { value: "2", label: "Work" },
  { value: "3", label: "Travel" },
];

export default function NewEditJournalEntryForm({
  editing,
  journalEntry,
}: NewEditJournalEntryForm) {
  const onSubmit = () => {};
  const [categories, setCategories] =
    useState<CategoryType[]>(defaultCategories);
  const form = useForm<z.infer<typeof journalEntrySchema>>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: journalEntry || {
      title: "",
      category: "",
      content: "",
    },
  });

  const addCategoryAction = useCallback(
    (newCategoryVal: string) => {
      const newCategory = {
        value: newCategoryVal.toLowerCase(),
        label: newCategoryVal.charAt(0).toUpperCase() + newCategoryVal.slice(1),
      };
      setCategories([...categories, newCategory]);
    },
    [setCategories, categories]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Input */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-alumni font-semibold text-lg">
                Title
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="What's your entry about?"
                  className="font-alumni text-lg h-14"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-alumni" />
            </FormItem>
          )}
        />

        {/* Category Selector */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-alumni font-semibold text-lg flex items-center gap-2">
                <Tag className="h-5 w-5" data-testid="category-tag-icon" />
                Category
              </FormLabel>
              <FormControl>
                <CategorySelector
                  selectedCategoryValue={field.value}
                  onChangeAction={field.onChange}
                  categories={categories}
                  addCategoryAction={addCategoryAction}
                />
              </FormControl>
              <FormMessage className="font-alumni" />
            </FormItem>
          )}
        />

        {/* Content Textarea */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-alumni font-semibold text-lg">
                Your Thoughts
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your heart out..."
                  className="font-alumni text-base min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-alumni" />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            className="font-alumni font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="font-alumni font-bold bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            {editing ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Entry
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
