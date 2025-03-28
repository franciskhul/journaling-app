import { JournalEntryInput } from "@/lib/validations/journalEntry";

export const saveJournalEntry = async (
  values: JournalEntryInput
): Promise<Response> => {
  return fetch("/api/v1/journal_entry/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: values.title,
      content: values.content,
      categoryId: values.categoryId,
    }),
  });
};
