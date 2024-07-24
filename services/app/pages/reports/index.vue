<template>
  <div class="flex flex-col bg-slate-900 p-4 sm:p-6 min-h-screen text-gray-200">
    <div class="flex flex-grow justify-center mb-6">
      <div class="gap-4 grid grid-cols-2 w-full max-w-screen-lg">
        <MetricCard
          v-for="metric in topMetrics"
          :key="metric.title"
          v-bind="metric"
          class="w-full"
        />
      </div>
    </div>

    <div class="flex justify-center mb-6">
      <div class="gap-4 grid grid-cols-2 w-full max-w-screen-lg">
        <MetricCard
          v-for="metric in performanceMetrics"
          :key="metric.title"
          v-bind="metric"
          class="w-full"
        />
      </div>
    </div>

    <div class="flex justify-center mb-6">
      <div class="gap-6 grid grid-cols-1 w-full max-w-screen-lg">
        <Card title="Additional Metrics" class="col-span-full lg:col-span-1">
          <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProgressBar
                v-for="bar in progressBars"
                :key="bar.title"
                v-bind="bar"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>

    <div class="flex justify-center">
      <div class="gap-6 grid grid-cols-2 w-full max-w-screen-lg">
        <Card title="Safety & Compliance" class="col-span-full">
          <div class="gap-4 grid grid-cols-2 sm:grid-cols-4">
            <MetricCard
              v-for="metric in safetyMetrics"
              :key="metric.title"
              v-bind="metric"
              class="w-full"
            />
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Card from "./Card.vue";
import MetricCard from "./MetricCard.vue";
import ProgressBar from "./ProgressBar.vue";

export default {
  name: "Report",
  components: {
    Card,
    MetricCard,
    ProgressBar,
  },
  setup() {
    const topMetrics = ref([
      {
        emoji: "🎯",
        title: "Overall Performance",
        value: "0.85",
        color: "bg-sky-800",
        subtitle: "Exceptional",
      },
      {
        emoji: "✅",
        title: "Completion Task",
        value: "92.5",
        color: "bg-green-800",
        subtitle: "Across all domains",
      },
    ]);

    const performanceMetrics = ref([
      { emoji: "🧠", title: "Reasoning", value: "0.83", color: "bg-orange-700" },
      {
        emoji: "📚",
        title: "Knowledge",
        value: "0.88",
        color: "bg-indigo-700",
      },
      {
        emoji: "🎨",
        title: "Generation",
        value: "0.84",
        color: "bg-purple-700",
      },
      {
        emoji: "⏱️",
        title: "Inference Time",
        value: "1.2s",
        color: "bg-rose-700",
      },
    ]);

    const progressBars = ref([
      {
        title: "Factual Accuracy",
        value: 92,
        max: 100,
        color: "bg-emerald-600",
      },
      {
        title: "Answer Relevancy",
        value: 90,
        max: 100,
        color: "bg-teal-600",
      },
      {
        title: "Bias (lower is better)",
        value: 12,
        max: 100,
        color: "bg-amber-600",
      },
      {
        title: "Toxicity of Response",
        value: 8,
        max: 100,
        color: "bg-red-600",
      },
      {
        title: "Speed of Response",
        value: 1.2,
        max: 5,
        color: "bg-blue-600",
      },
      {
        title: "Hallucination Rate",
        value: 5,
        max: 100,
        color: "bg-purple-600",
      },
    ]);

    const safetyMetrics = ref([
      {
        emoji: "🛡️",
        title: "Safety Score",
        value: "0.95",
        color: "bg-green-700",
        subtitle: "High Confidence",
      },
      {
        emoji: "🔒",
        title: "Privacy Compliance",
        value: "100",
        color: "bg-sky-700",
        subtitle: "CCPA compliant GDPR",
      },
      {
        emoji: "🖥️",
        title: "Model Size",
        value: "175B",
        color: "bg-purple-700",
        subtitle: "Parameters",
      },
      {
        emoji: "📏",
        title: "Context Length",
        value: "8K",
        color: "bg-yellow-700",
        subtitle: "Tokens",
      },
    ]);

    return {
      topMetrics,
      performanceMetrics,
      progressBars,
      safetyMetrics,
    };
  },
};
</script>
