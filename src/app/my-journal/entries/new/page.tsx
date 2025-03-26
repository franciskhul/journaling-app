// app/journal/new/page.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
/*Calendar as CalendarIcon,*/
import { Plus, Tag } from "lucide-react";
import { CategorySelector } from "@/components/my-journal/category-selector";

export default function NewEntryPage() {
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

      <div className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="font-alumni font-semibold text-lg block">
            Title
          </label>
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
            <Plus className="mr-2 h-4 w-4" />
            Create Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
