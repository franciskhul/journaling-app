import NewEditJournalEntryForm from "@/components/my-journal/new-edit-journal-entry-form";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function EditEntryPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log("id", id);
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

      <NewEditJournalEntryForm editing />
    </div>
  );
}
