import { JournalEntryFormValues } from "@/components/my-journal/new-edit-journal-entry-form";

export const saveJournalEntry = async (
  values: JournalEntryFormValues
): Promise<Response> => {
  return fetch("/api/v1/journal_entry/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: values.title,
      content: values.content,
      categoryId: values.category,
    }),
  });
};
