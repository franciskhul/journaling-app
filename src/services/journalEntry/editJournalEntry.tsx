import { JournalEntryInput } from "@/lib/validations/journalEntry";

export const editJournalEntry = async (
  values: JournalEntryInput,
  journalEntryId: string
): Promise<Response> => {
  return fetch(`/api/v1/journal_entries/${journalEntryId}/edit`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: values.title,
      content: values.content,
      categoryId: values.categoryId,
    }),
  });
};
