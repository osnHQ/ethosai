<template>
    <div
        class="w-full relative shadow bg-white flex items-start justify-between text-left text-base text-dimgray font-inter">
        <div>
            <aside :class="{
                'hidden': !isSidebarOpen && isMobile,
                'block': isSidebarOpen || !isMobile,
                'fixed md:relative': true,
                'inset-0': isSidebarOpen && isMobile,
                'z-30': true,
                'min-h-screen': true,
                'transition-transform transform md:translate-x-0': true
            }" class="w-64 min-h-screen bg-white shadow-lg md:block">
                <Sidebar @toggleSidebar="toggleSidebar" />
            </aside>
        </div>

        <div v-if="isSidebarOpen && isMobile" class="fixed inset-0 bg-black opacity-30 z-20" @click="toggleSidebar">
        </div>
        <div>
            <main class="flex-1 flex flex-col items-start justify-start max-w-280">
                <section
                    class="flex flex-col px-8 pb-3.5 mt-4 w-full bg-white rounded shadow-sm max-w-[1676px] max-md:px-5 max-md:max-w-full">
                    <header class="max-md:max-w-full">
                        <div class="flex gap-5 max-md:flex-col max-md:gap-0">
                            <div class="flex flex-col w-[81%] max-md:ml-0 max-md:w-full">
                                <div class="flex flex-col max-md:mt-10 max-md:max-w-full">
                                    <div
                                        class="flex gap-5 justify-between px-0.5 w-full max-md:flex-wrap max-md:max-w-full">
                                        <h1
                                            class="flex gap-5 self-start text-3xl leading-10 text-zinc-900 max-md:flex-wrap max-md:max-w-full">
                                            <span class="flex-auto font-bold">User Dashboard</span>
                                            <NuxtImg loading="lazy" src="/loading.png" alt="" class="w-10" />
                                        </h1>

                                    </div>
                                    <p class="ml-1 text-base leading-7 text-md text-gray-800 max-md:max-w-full">
                                        Your personalized overview of Ethos AI activities and metrics. </p>
                                </div>
                            </div>
                            <div class="flex flex-col ml-5 w-[35%] max-md:ml-0 max-md:w-full">
                                <div class="flex flex-col grow max-md:mt-10">
                                    <div class="flex flex-row gap-3 items-center mt-3">
                                        <div v-if="fileTypeIcon" class="mt-2">
                                            <NuxtImg :src="fileTypeIcon" alt="File Type Icon"
                                                class="w-16 h-16 object-cover border border-gray-300 rounded-md" />
                                        </div>
                                        <p v-if="selectedFileName" class="mt-2 text-gray-700 dark:text-gray-300">
                                            Selected
                                            file: {{
                                                selectedFileName }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div class="dark:bg-gray-700 h-[595px] mt-2 border border-gray-300 shadow-lg rounded-lg">
                        <h1 class="text-xl font-extrabold ml-3 mt-4">Overview</h1>

                        <!-- 1stttt-->
                        <div class=" flex flex-row justify-between ml-5 mr-5">
                            <div
                                class="relative flex flex-col my-3 mx-3 bg-white shadow-md border border-slate-200 rounded-lg w-76">
                                <div class="mx-3 mb-0 border-b border-slate-200 pt-3 pb-2 px-1 flex justify-between">
                                    <span class="text-xl text-slate-600 font-medium">
                                        Evals Submitted
                                    </span>
                                    <div
                                        class="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                            <path d="M20 2H6.5A2.5 2.5 0 0 0 4 4.5v15" />
                                            <path d="M20 2v15a2.5 2.5 0 0 1-2.5 2.5H4" />
                                            <path d="M8 6h8" />
                                            <path d="M8 10h8" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="p-4">
                                    <h5 class="mb-3 ml-2 text-slate-800 text-3xl font-semibold">
                                        24
                                    </h5>
                                    <p class="text-slate-600 leading-normal font-light">
                                    <div
                                        class="bg-red-100 text-red-700 rounded-full px-4 py-2 inline-flex items-center space-x-2">
                                        <span>25%</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 3v18m7-7l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    </p>
                                </div>
                            </div>


                            <div
                                class="relative flex flex-col my-3 mx-3 bg-white shadow-md border border-slate-200 rounded-lg w-76">
                                <div class="mx-3 mb-0 border-b border-slate-200 pt-3 pb-2 px-1 flex justify-between">
                                    <span class="text-xl text-slate-600 font-medium">
                                        Audited Evals
                                    </span>
                                    <div
                                        class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" class="h-6 w-6">
                                            <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
                                            <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h8"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div class="p-4">
                                    <h5 class="mb-3 ml-2 text-slate-800 text-3xl font-semibold">
                                        11
                                    </h5>
                                    <p class="text-slate-600 leading-normal font-light">
                                    <div
                                        class="bg-green-100 text-green-700 rounded-full px-4 py-2 inline-flex items-center space-x-2">
                                        <span>25%</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 21V3m-7 7l7-7 7 7" />
                                        </svg>
                                    </div>
                                    </p>
                                </div>
                            </div>

                            <!-- 3rdddd-->
                            <div
                                class="relative flex flex-col my-3 mx-3 bg-white shadow-md border border-slate-200 rounded-lg w-76">
                                <div class="mx-3 mb-0 border-b border-slate-200 pt-3 pb-2 px-1 flex justify-between">
                                    <span class="text-xl text-slate-600 font-medium">
                                        LLM Eval Runs
                                    </span>
                                    <div
                                        class="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="250"
                                            height="250" viewBox="-20 -20 300 300" xml:space="preserve">

                                            <defs>
                                            </defs>
                                            <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
                                                transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                                                <path
                                                    d="M 42.918 50.129 c -1.144 0 -2.277 -0.497 -3.054 -1.454 c -1.367 -1.685 -1.108 -4.159 0.577 -5.526 l 22.419 -18.18 c 1.685 -1.364 4.159 -1.108 5.526 0.577 c 1.366 1.686 1.108 4.159 -0.577 5.526 L 45.39 49.251 C 44.662 49.842 43.787 50.129 42.918 50.129 z"
                                                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                                <path
                                                    d="M 71.946 43.083 c -1.343 0 -2.648 -0.69 -3.381 -1.924 l -6.608 -11.133 c -1.108 -1.865 -0.493 -4.276 1.372 -5.383 c 1.866 -1.107 4.277 -0.492 5.383 1.373 l 4.664 7.857 l 10.793 -5.967 c 1.9 -1.05 4.289 -0.361 5.339 1.537 c 1.049 1.899 0.362 4.289 -1.537 5.339 l -14.128 7.81 C 73.242 42.925 72.59 43.083 71.946 43.083 z"
                                                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                                <path
                                                    d="M 38.608 34.788 c -1.203 0 -2.391 -0.551 -3.161 -1.593 c -1.29 -1.744 -0.922 -4.204 0.822 -5.494 l 11.837 -8.758 c 1.092 -0.808 2.525 -0.995 3.787 -0.492 l 14.893 5.92 c 2.016 0.801 3.001 3.085 2.199 5.102 c -0.801 2.017 -3.086 3 -5.101 2.2 l -12.862 -5.112 l -10.08 7.458 C 40.239 34.537 39.42 34.788 38.608 34.788 z"
                                                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                                <circle cx="76.622" cy="19.962" r="6.782"
                                                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                    transform="  matrix(1 0 0 1 0 0) " />
                                                <path
                                                    d="M 20.115 74.459 c -1.237 0 -2.455 -0.582 -3.219 -1.673 c -1.246 -1.776 -0.816 -4.226 0.96 -5.472 l 15.626 -10.962 l 5.916 -11.901 c 0.966 -1.943 3.325 -2.733 5.266 -1.77 c 1.943 0.966 2.735 3.324 1.77 5.266 l -6.36 12.795 c -0.292 0.587 -0.726 1.091 -1.262 1.467 L 22.368 73.746 C 21.681 74.228 20.894 74.459 20.115 74.459 z"
                                                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                                <path
                                                    d="M 57.856 56.365 c -0.504 0 -1.017 -0.098 -1.511 -0.304 l -14.943 -6.235 c -2.002 -0.835 -2.948 -3.136 -2.112 -5.138 c 0.836 -2.002 3.137 -2.946 5.138 -2.112 L 59.37 48.81 c 2.003 0.835 2.948 3.136 2.113 5.138 C 60.854 55.455 59.394 56.365 57.856 56.365 z"
                                                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                                <path
                                                    d="M 50.014 76.82 c -0.467 0 -0.943 -0.083 -1.405 -0.261 c -2.026 -0.777 -3.039 -3.049 -2.262 -5.075 l 7.842 -20.456 c 0.777 -2.026 3.048 -3.04 5.075 -2.263 s 3.038 3.049 2.263 5.075 l -7.843 20.456 C 53.084 75.86 51.594 76.82 50.014 76.82 z"
                                                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                                <path
                                                    d="M 31.603 45.981 H 1.964 C 0.879 45.981 0 45.102 0 44.017 c 0 -1.085 0.879 -1.964 1.964 -1.964 h 29.639 c 1.085 0 1.964 0.879 1.964 1.964 C 33.568 45.102 32.688 45.981 31.603 45.981 z"
                                                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                                <path
                                                    d="M 27.581 35.524 H 9.204 c -1.085 0 -1.964 -0.879 -1.964 -1.964 s 0.879 -1.964 1.964 -1.964 h 18.377 c 1.085 0 1.964 0.879 1.964 1.964 S 28.666 35.524 27.581 35.524 z"
                                                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                                <path
                                                    d="M 25.168 56.438 H 9.204 c -1.085 0 -1.964 -0.879 -1.964 -1.964 s 0.879 -1.964 1.964 -1.964 h 15.964 c 1.085 0 1.964 0.879 1.964 1.964 S 26.253 56.438 25.168 56.438 z"
                                                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                            </g>
                                        </svg>

                                    </div>





                                </div>


                                <div class="p-4">
                                    <h5 class="mb-3 ml-2 text-slate-800 text-3xl font-semibold">
                                        23
                                    </h5>
                                    <p class="text-slate-600 leading-normal font-light">
                                    <div
                                        class="bg-green-100 text-green-700 rounded-full px-4 py-2 inline-flex items-center space-x-2">
                                        <span>25%</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 21V3m-7 7l7-7 7 7" />
                                        </svg>
                                    </div>
                                    </p>
                                </div>
                            </div>




                        </div>
                        <div class="flex justify-center space-x-22 mt-3">
                            <ChartCard title="Community Eval Audits" :percent="72" :completed="397000" :total="551000"
                                chartBackgroundColor="#00bcd4" chartBorderColor="#00bcd4" buttonText="View report" />

                            <ChartCard title="Sales Progress" :percent="30" :completed="30" :total="100" theme="red"
                                buttonText="View Report" />

                        </div>

                    </div>
                </section>
            </main>
        </div>
    </div>
</template>

<script lang="ts">
import ChartCard from '@/components/ChartCard.vue';
import Flatpickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useWindowSize } from '@vueuse/core';

interface Config {
  id: number;
  name: string;
  category: string;
  tags: string[];
  reviewStatus: string;
  dateSubmitted: string;
  lastReviewed: string;
  submittedBy: { username: string };
  numOfReviews: number;
}

export default defineComponent({
  components: {
    ChartCard,
    Flatpickr,
  },
  setup() {
    const isSidebarOpen = ref(false); 
    const { width } = useWindowSize(); // Track window size
    const isMobile = computed(() => width.value < 768); 

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    // Dashboard-specific state variables
    const searchQuery = ref('');
    const dateRange = ref(['2023-01-01', '2024-12-31']);
    const selectedFileName = ref('');
    const fileTypeIcon = ref('');
    const selectedCategory = ref('');
    const selectedReviewStatus = ref('');
    const categories = ref<string[]>(['Health', 'Finance', 'Technology']);
    const reviewStatuses = ref<string[]>(['Pending', 'Reviewed', 'Rejected']);
    const configs = ref<Config[]>([]);
    const filteredConfigs = computed(() =>
      configs.value.filter((config) =>
        config.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    const flatpickrConfig = ref({
      mode: 'range' as const,
      dateFormat: 'Y-m-d',
      defaultDate: dateRange.value,
    });

    const fetchConfigs = async () => {
      try {
        const response = await fetch('/api/configs'); 
        configs.value = await response.json();
      } catch (error) {
        console.error('Failed to fetch configs:', error);
      }
    };

    onMounted(() => {
      fetchConfigs();
    });

    return {
      isSidebarOpen,
      isMobile,
      toggleSidebar,
      searchQuery,
      dateRange,
      selectedFileName,
      fileTypeIcon,
      selectedCategory,
      selectedReviewStatus,
      categories,
      reviewStatuses,
      configs,
      filteredConfigs,
      flatpickrConfig,
    };
  },
});
</script>
