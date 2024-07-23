<template>
  <div class="flex flex-col bg-slate-900 p-4 sm:p-6 min-h-screen text-gray-200">
    <h2 class="mb-4 sm:mb-6 font-bold text-2xl text-center text-gray-200 sm:text-3xl md:text-4xl">
      LLM Evaluation Report
    </h2>

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
          <div class="space-y-4">
            <ProgressBar
              v-for="bar in progressBars"
              :key="bar.title"
              v-bind="bar"
            />
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
        title: "Coverage Set Test",
        value: 78.3,
        max: 100,
        color: "bg-sky-600",
      },
      {
        title: "Biasness (lower is better)",
        value: 12,
        max: 100,
        color: "bg-amber-600",
      },
      {
        title: "Factual Accuracy",
        value: 92,
        max: 100,
        color: "bg-emerald-600",
      },
      {
        title: "Ethical Alignment",
        value: 88,
        max: 100,
        color: "bg-violet-600",
      },
    ]);

    const safetyMetrics = ref([
      {
        emoji: "🛡️",
        title: "Safety Score",
        value: "0.95",
        color: "bg-green-700",
        subtitle: "confidence High",
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
