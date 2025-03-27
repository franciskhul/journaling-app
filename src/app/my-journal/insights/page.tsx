import { PieChart, BarChart, LineChart, Clock } from "lucide-react";
import CategoryPieChart from "@/components/insight/ui/category-pie-chart";
import WordCountLineChart from "@/components/insight/ui/word-count-line-chart";
import CategoryWordCountBarChart from "@/components/insight/ui/category-word-count-bar-chart";
import WordTimetLineChart from "@/components/insight/ui/writing-time-line-chart";
import ChartCard from "@/components/insight/chart-card";

export default function InsightsOverview() {
  return (
    <div className="p-6 bg-amber-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-fugaz text-3xl bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            Journal Insights
          </h1>
        </div>

        {/* Grid Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Category Distribution */}
          <ChartCard
            title="Journal Entries By Category"
            icon={<PieChart className="h-5 w-5 text-amber-600" />}
          >
            <CategoryPieChart />
          </ChartCard>

          {/* Word Count Trends */}
          <ChartCard
            title="Words Count Trends"
            icon={<LineChart className="h-5 w-5 text-amber-600 mr-2" />}
          >
            <WordCountLineChart />
          </ChartCard>
          {/* Word Count Trends */}

          {/* Entry Length by Category */}
          <ChartCard
            title="Words Count By Category"
            icon={<BarChart className="h-5 w-5 text-amber-600 mr-2" />}
          >
            <CategoryWordCountBarChart />
          </ChartCard>
          {/* Entry Length by Category */}

          {/* Time of Day Analysis */}
          <ChartCard
            title="Writing Times"
            icon={<Clock className="h-5 w-5 text-amber-600 mr-2" />}
          >
            <WordTimetLineChart />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
