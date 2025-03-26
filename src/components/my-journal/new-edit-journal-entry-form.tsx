import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategorySelector } from "@/components/my-journal/category-selector";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Edit } from "lucide-react";

interface NewEditJournalEntryForm {
  editing: boolean;
}

export default function NewEditJournalEntryForm({
  editing,
}: NewEditJournalEntryForm) {
  return (
    <div className="space-y-6">
      {/* Title Input */}
      <div className="space-y-2">
        <label className="font-alumni font-semibold text-lg block">Title</label>
        <Input
          placeholder="What's your entry about?"
          className="font-alumni text-lg h-14"
        />
      </div>

      {/* Category Selector */}
      <div className="space-y-2">
        <label className="font-alumni font-semibold text-lg flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Category
        </label>
        <CategorySelector />
      </div>

      {/* Content Textarea */}
      <div className="space-y-2">
        <label className="font-alumni font-semibold text-lg block">
          Your Thoughts
        </label>
        <Textarea
          placeholder="Write your heart out..."
          className="font-alumni text-base min-h-[300px]"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-between pt-4">
        <Button variant="outline" className="font-alumni font-bold">
          Cancel
        </Button>
        <Button className="font-alumni font-bold bg-gradient-to-r from-blue-600 to-indigo-600">
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
    </div>
  );
}
