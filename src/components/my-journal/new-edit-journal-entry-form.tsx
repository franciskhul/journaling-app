"use client";
import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { Plus, Tag, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveJournalEntry } from "@/services/journalEntry/saveJournalEntry";
import {
  isJournalEntryValidationError,
  isJournalEntryConflictError,
  ApiResponse,
  JournalEntrySuccess,
} from "@/types/api";

// Define validation schema
const journalEntrySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  category: z.string().min(1, "Please select a category"),
  content: z
    .string()
    .min(4, "Content must be at least 4 characters")
    .max(5000, "Content is too long"),
});

export type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;

interface NewEditJournalEntryForm {
  editing: boolean;
  journalEntry?: z.infer<typeof journalEntrySchema>;
  onSuccess?: () => void;
}

const defaultCategories = [
  { value: "6d6491af-c8bc-4b81-ab1c-7d9bbce8605f", label: "Personal" },
  { value: "0b817598-7848-47f6-83fd-2af5de3b7b47", label: "Work" },
  { value: "00e44d6d-c10b-49b8-8bbc-20ca81bb8cc2", label: "Travel" },
];

export default function NewEditJournalEntryForm({
  editing,
  journalEntry,
  onSuccess,
}: NewEditJournalEntryForm) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const onSubmitAction = async (values: JournalEntryFormValues) => {
    setPending(true);
    try {
      const response = await saveJournalEntry(values);
      console.log(response);

      // error
      if (!response.ok) {
        const data: ApiResponse<JournalEntrySuccess> = await response.json();

        // Handle validation errors (400)
        if (response.status === 400 && isJournalEntryValidationError(data)) {
          Object.entries(data.details).forEach(([field, messages]) => {
            form.setError(field as keyof typeof values, {
              type: "manual",
              message: messages.join(", "),
            });
          });
          toast.error("Please fix the form errors");
          return;
        }

        // Handle conflict errors (409)
        if (response.status === 409 && isJournalEntryConflictError(data)) {
          form.setError("category", {
            type: "manual",
            message: data.error,
          });
          toast.error(data.error);
          return;
        }

        throw new Error(data.error || "Operation failed");
      }

      // Handle success
      const successMessage = editing
        ? "Journal entry updated successfully!"
        : "New journal entry created successfully!";

      toast.success(successMessage);

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
        router.push("/my-journal");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setPending(false);
    }
  };

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
      <form onSubmit={form.handleSubmit(onSubmitAction)} className="space-y-6">
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
              <FormLabel
                className="font-alumni font-semibold text-lg flex items-center gap-2"
                htmlFor="category-selector"
              >
                <Tag className="h-5 w-5" data-testid="category-tag-icon" />
                Category
              </FormLabel>
              <FormControl>
                <CategorySelector
                  id={"category-selector"}
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
          {pending ? (
            <Button
              type="submit"
              className="font-alumni font-bold bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {editing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Creating Entry...
                </>
              )}
            </Button>
          ) : (
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
          )}
        </div>
      </form>
    </Form>
  );
}
