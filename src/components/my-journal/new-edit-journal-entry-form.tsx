"use client";
import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { type CategoryWithUserFlag } from "@/types/category";
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
import { CategorySelector } from "@/components/my-journal/category-selector";
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
import { JournalEntryInput } from "@/lib/validations/journalEntry";
import { editJournalEntry } from "@/services/journalEntry/editJournalEntry";

// Define validation schema
const journalEntrySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  content: z
    .string()
    .min(4, "Content must be at least 4 characters")
    .max(5000, "Content is too long"),
});

export type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;

interface NewEditJournalEntryForm {
  editing: boolean;
  journalEntry?: z.infer<typeof journalEntrySchema>;
  journalEntryId?: string;
  onSuccess?: () => void;
  categories: CategoryWithUserFlag[];
}

export default function NewEditJournalEntryForm({
  editing,
  journalEntry,
  onSuccess,
  journalEntryId,
  categories: defaultCategories,
}: NewEditJournalEntryForm) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const onSubmitAction = async (values: JournalEntryInput) => {
    setPending(true);
    try {
      const response =
        editing && journalEntryId
          ? await editJournalEntry(values, journalEntryId)
          : await saveJournalEntry(values);
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
          form.setError("categoryId", {
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
        router.push("/my-journal"); // TODO: navigate to the single journal entry
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setPending(false);
    }
  };

  const [categories, setCategories] =
    useState<CategoryWithUserFlag[]>(defaultCategories);
  const form = useForm<z.infer<typeof journalEntrySchema>>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: journalEntry || {
      title: "",
      categoryId: "",
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
          name="categoryId"
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
              disabled={pending}
              className="font-alumni font-bold bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {editing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
