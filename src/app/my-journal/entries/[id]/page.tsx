// app/journal/[slug]/page.tsx
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
  Tag,
} from "lucide-react";
import Link from "next/link";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  readingTime: number;
  mood: string;
  contentSummary: string;
}

export default function EntryPage({ params }: { params: { id: string } }) {
  // Fetch your entry data here (mock data for example)
  const entry: JournalEntry = {
    id: params.id,
    title: "My Amazing Adventure in the Mountains",
    content: `The crisp morning air filled my lungs as I laced up my hiking boots. Today was the day I'd conquer Eagle Peak Trail—a challenge I'd set for myself months ago. 

    As I ascended, the trees thinned, revealing panoramic views that made every aching muscle worth it. Halfway up, I met a curious marmot who seemed just as interested in me as I was in him. We shared a quiet moment, him nibbling on wildflowers, me catching my breath.
    
    The summit brought an unexpected rain shower, but rather than ruin the day, it created a rainbow that arched perfectly over the valley below. Nature's reward for perseverance.`,
    category: "Travel",
    createdAt: new Date("2023-11-15"),
    readingTime: 3,
    mood: "excited",
    contentSummary: "",
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back Button and Actions */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/journal">
          <Button variant="ghost" className="font-alumni gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" className="font-alumni gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" className="font-alumni gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Entry Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-fugaz text-3xl text-neutral-900">
            {entry.title}
          </h1>
          <span className="text-3xl">
            {entry.mood === "excited" ? "🤩" : "😊"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-alumni text-neutral-600">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>
              {entry.createdAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{entry.readingTime} min read</span>
          </div>

          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span className="capitalize">{entry.category}</span>
          </div>
        </div>
      </div>

      {/* Entry Content */}
      <article className="prose prose-lg max-w-none font-alumni">
        {entry.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="mb-4 text-neutral-800 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </article>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-neutral-200">
        <Button variant="outline" className="font-alumni gap-2">
          <Edit className="h-4 w-4" />
          Edit this entry
        </Button>
      </div>
    </div>
  );
}
