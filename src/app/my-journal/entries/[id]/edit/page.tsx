import NewEditJournalEntryForm from "@/components/my-journal/new-edit-journal-entry-form";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/next-auth/checkAuth";
import { getUserAndSystemCategories } from "@/services/category/getUserAndSystemCategories";
import { getJournalEntryByIdForEdit } from "@/services/journalEntry/getJournalEntryByIdForEdit";

export default async function EditEntryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const { user } = await checkAuth();

  if (!user?.id)
    redirect(
      "/auth/login?callbackUrl=" + encodeURIComponent(window.location.pathname)
    );
  const categories = await getUserAndSystemCategories(user.id);
  const journalEntry = await getJournalEntryByIdForEdit({
    journalEntryId: id,
    userId: user.id,
    userRole: user.role,
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-fugaz text-3xl text-neutral-900">
          Edit Journal Entry
        </h1>
        <Button className="font-alumni font-bold bg-gradient-to-r from-blue-600 to-indigo-600 ml-auto">
          <Edit className="mr-2 h-4 w-4" />
          Save Entry
        </Button>
      </div>

      <NewEditJournalEntryForm
        editing
        categories={categories}
        journalEntry={journalEntry}
        journalEntryId={id}
      />
    </div>
  );
}
