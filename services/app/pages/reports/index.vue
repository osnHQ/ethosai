<template>
  <div class="flex flex-col bg-slate-900 p-4 sm:p-6 text-gray-200">
    <div class="flex flex-grow justify-center">
      <div class="gap-4 grid grid-cols-2 w-full max-w-screen-lg max-h-32">
        <MetricCard
          v-for="metric in topMetrics"
          :key="metric.title"
          v-bind="metric"
          class="w-full"
        />
      </div>
    </div>
    
    <div class="flex justify-center mt-4">
      <div class="gap-6 grid grid-cols-1 w-full max-w-screen-lg">
        <Card title="Metrics" class="col-span-full lg:col-span-1">
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
    <div class="flex justify-center mt-4 hidden">
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

<script setup>
import { ref, watch } from 'vue';
import Card from './Card.vue';
import MetricCard from './MetricCard.vue';
import ProgressBar from './ProgressBar.vue';

const props = defineProps({
  result: {
    type: Object,
    default: () => ({
      accuracy: 0,
      relevance: 0,
      bias: 0,
    }),
  },
});


const accuracy = ref(props.result.accuracy || 0);
const relevance = ref(props.result.relevance || 0);
const bias = ref(props.result.bias || 0);

const performance = computed(() => Math.floor((accuracy.value + relevance.value + bias.value) / 3));

const topMetrics = ref([
  {
    emoji: '🎯',
    title: 'Overall Performance',
    value: performance,
    color: 'bg-sky-800',
    subtitle: 'Exceptional',
  },
  {
    emoji: '🛡️',
    title: 'Safety Score',
    value: '-', // TODO,
    color: 'bg-green-700',
    subtitle: 'High Confidence',
  },
]);

const progressBars = ref([
  {
    title: 'Factual Accuracy',
    value: accuracy,
    max: 100,
    color: 'bg-emerald-600',
  },
  {
    title: 'Answer Relevancy',
    value: relevance,
    max: 100,
    color: 'bg-teal-600',
  },
]);

const safetyMetrics = ref([
  {
    emoji: '🛡️',
    title: 'Safety Score',
    value: '0.95',
    color: 'bg-green-700',
    subtitle: 'High Confidence',
  },
  {
    emoji: '🔒',
    title: 'Privacy Compliance',
    value: '100',
    color: 'bg-sky-700',
    subtitle: 'GDPR compliant',
  },
  {
    emoji: '🖥️',
    title: 'Model Size',
    value: '175B',
    color: 'bg-purple-700',
    subtitle: 'Parameters',
  },
  {
    emoji: '📏',
    title: 'Context Length',
    value: '8K',
    color: 'bg-yellow-700',
    subtitle: 'Tokens',
  },
]);

watch(
  () => props.result,
  (newResult) => {
    if (newResult) {
      accuracy.value = newResult.accuracy || 0;
      relevance.value = newResult.relevance || 0;
      bias.value = newResult.bias || 0;
    }
  },
  { immediate: true }
);
</script>
