import { Button } from "@/components/ui/button";
import NewEditJournalEntryForm from "@/components/my-journal/new-edit-journal-entry-form";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/next-auth/authOptions";
import { getUserAndSystemCategories } from "@/services/category/getUserAndSystemCategories";

export default async function NewJournalEntryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Handle unauthorized case
    return <div>Unauthorized</div>;
  }

  const categories = await getUserAndSystemCategories(session.user.id);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-fugaz text-3xl text-neutral-900">
          New Journal Entry
        </h1>
        <Button className="font-alumni font-bold bg-gradient-to-r from-blue-600 to-indigo-600 ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Entry
        </Button>
      </div>
      <NewEditJournalEntryForm editing={false} categories={categories} />
    </div>
  );
}
