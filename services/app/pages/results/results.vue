<template>
    <div
        class="w-full relative shadow bg-white flex items-start justify-end text-left text-base text-dimgray font-inter">
        <main class="flex-1 flex flex-col items-start justify-start pt-6 px-0 pb-0 max-w-280">
            <section
                class="flex flex-col px-8 pt-8 pb-3.5 mt-10 w-full bg-white rounded shadow-sm max-w-[1676px] max-md:px-5 max-md:max-w-full">
                <header class="max-md:max-w-full">
                    <div class="flex gap-5 max-md:flex-col max-md:gap-0">
                        <div class="flex flex-col w-[81%] max-md:ml-0 max-md:w-full">
                            <div class="flex flex-col max-md:mt-10 max-md:max-w-full">
                                <div
                                    class="flex gap-5 justify-between px-0.5 w-full max-md:flex-wrap max-md:max-w-full">
                                    <h1
                                        class="flex gap-5 self-start text-3xl leading-10 text-zinc-900 max-md:flex-wrap max-md:max-w-full">
                                        <span class="flex-auto">Recent Results</span>
                                    </h1>

                                </div>
                                <p class="mt-2 text-base leading-7 text-neutral-800 max-md:max-w-full">
                                    Explore the latest evaluation results for your LLM tests. </p>
                            </div>
                        </div>

                    </div>


                    <div class="flex w-full h-full">
                        <!-- Left Column (30%) -->
                        <div class="w-1/3 p-4 space-y-4">
                            <!-- Card 1 -->
                            <div class="bg-purple-100 p-4 rounded-lg shadow-md">
                                <h3 class="text-lg font-semibold">Total Evaluations Run</h3>
                                <p class="text-3xl font-bold">23</p>
                                <p class="text-sm text-green-600">↑ 25% since last week</p>
                                <div class="mt-2">
                                    <!-- Replace with actual bar chart or image -->
                                    <div class="bg-purple-400 h-16 rounded-md"></div>
                                </div>
                            </div>

                            <!-- Card 2 -->
                            <div class="bg-blue-100 p-4 rounded-lg shadow-md">
                                <h3 class="text-lg font-semibold">Average Accuracy</h3>
                                <p class="text-3xl font-bold">56%</p>
                                <p class="text-sm text-red-600">↓ 5% since last week</p>
                                <div class="mt-2">
                                    <!-- Replace with actual bar chart or image -->
                                    <div class="bg-blue-400 h-16 rounded-md">
                                        <BarChartC />
                                    </div>
                                </div>
                            </div>

                            <!-- Card 3 -->
                            <div class="bg-red-100 p-4 rounded-lg shadow-md">
                                <h3 class="text-lg font-semibold">Total Cost Incurred</h3>
                                <p class="text-3xl font-bold">$ 55</p>
                                <p class="text-sm text-green-600">↑ 5%</p>
                                <div class="mt-2">
                                    <!-- Replace with actual bar chart or image -->
                                    <div class="bg-red-400 h-16 rounded-md"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column (70%) -->
                        <div class="w-2/3 p-4">
                            <!-- uPlot Chart Container -->
                            <div ref="uPlotContainer" class="w-full h-full bg-white"></div>
                        </div>
                    </div>
                </header>
                <div class="flex flex-wrap gap-5 mt-10 text-sm leading-5 items-center">
                    <div class="flex gap-2 flex-grow items-center">
                        <div
                            class="flex py-2 rounded mr-3 border border-solid bg-black bg-opacity-0 border-zinc-900 text-neutral-300 flex-grow w-52">
                            <img loading="lazy" src="public/search.png" alt="" class="w-5" />
                            <input v-model="searchQuery" type="text"
                                placeholder="Search for the configurations or LLms here."
                                class="flex-grow outline-none focus:outline-none focus:shadow-none text-black placeholder-text-2 text-3 w-50" />
                        </div>
                        <div class="flex">
                            <label for="dateRange" class="text-[#323842] ml-5">Select date range</label>
                            <div
                                class="flex items-center mr-2 w-3/4 justify-center pr-2 py-2 bg-white rounded border border-solid border-neutral-300 text-zinc-900">
                                <Flatpickr v-model="dateRange" :config="flatpickrConfig"
                                    class="grow w-full md:w-auto outline-none focus:outline-none focus:shadow-none" />

                                <img loading="lazy" src="public/downarrow.png" alt=""
                                    class="shrink-0 w-3.5 aspect-square" />
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-x-5 items-center text-zinc-900 flex-grow">
                        <!-- Category Filter -->
                        <select v-model="selectedCategory"
                            class="bg-white border border-solid border-zinc-900 rounded px-2 py-2 w-full md:w-auto">
                            <option value="">Filter by category</option>
                            <option v-for="category in categories" :key="category" :value="category">
                                {{ category }}
                            </option>
                        </select>


                    </div>
                </div>


                <div
                    class="flex gap-5 items-start mt-3.5 text-sm leading-6 text-right text-cyan-500 max-md:flex-wrap max-md:max-w-full">
                    <img loading="lazy" src="public/question.png" alt="" class="shrink-0 w-6 aspect-square" />
                    <p class="flex-auto mt-3">
                        Total <span class="font-bold text-cyan-500">551287</span> configs
                    </p>
                </div>
                <div class="overflow-x-auto">
                    <table
                        class="mt-6 w-full text-sm leading-5 rounded border border-gray-100 border-solid bg-black bg-opacity-0">
                        <thead>
                            <tr class="font-semibold text-gray-600 bg-gray-50">
                                <th class="px-4 py-4 font-bold text-left">Config File Name</th>
                                <th class="px-4 py-4 font-bold text-left">Category</th>
                                <th class="px-4 py-4 font-bold text-left">Tags</th>
                                <th class="px-4 py-5 font-bold text-left">Review Status</th>
                                <th class="px-3.5 py-3.5 font-bold text-left">Date <span
                                        class="font-bold">Submitted</span></th>
                                <th class="px-4 py-3.5 font-bold text-left">Last Reviewed</th>
                                <th class="px-4 py-4 font-bold text-left">Submitted by</th>
                                <th class="pl-10 py-5 font-bold text-left"># of reviews</th>
                                <th class="px-8 py-5 font-bold text-center max-md:px-5 truncate">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="config in filteredConfigs" :key="config.configFileName" class="bg-white">
                                <td class="px-4 py-12 font-bold">{{ config.configFileName }}</td>
                                <td class="px-4 py-12">{{ config.category }}</td>
                                <td class="px-4 py-11">
                                    <div class="flex gap-1 text-xs leading-5 text-blue-500">
                                        <span v-for="tag in config.tags" :key="tag"
                                            class="px-2 py-2.5 bg-sky-50 rounded-2xl">{{ tag
                                            }}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-12">{{ config.reviewStatus }}</td>
                                <td class="px-4 py-12">{{ config.dateSubmitted }}</td>
                                <td class="px-4 py-12">{{ config.lastReviewed }}</td>
                                <td class="px-4 py-10">
                                    <div class="flex gap-2">
                                        <img :src="config.submittedBy.avatarUrl" alt="Avatar"
                                            class="w-9 aspect-square" />
                                        <span class="my-auto">{{ config.submittedBy.username }}</span>
                                    </div>
                                </td>
                                <td class="pl-10 py-12">{{ config.numOfReviews }}</td>
                                <td class="px-8 py-12 text-center text-cyan-500 max-md:px-5">
                                    <a href="#" class="hover:underline">View/Start Review</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <nav class="flex gap-1 self-center mt-14 max-w-full text-sm leading-5 whitespace-nowrap text-zinc-400 w-[344px] max-md:mt-10"
                    aria-label="Pagination">
                    <a href="#" class="flex gap-0.5 text-white">
                        <img loading="lazy" src="public/paginationleft.png" alt="Previous page"
                            class="w-5 h-5 mt-3.5 mr-2" />
                        <span class="sr-only">Previous page</span>
                    </a>
                    <a href="#" aria-current="page"
                        class="justify-center items-start px-4 py-3.5 bg-cyan-500 rounded text-white">
                        1
                    </a>
                    <a href="#"
                        class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
                        2
                    </a>
                    <a href="#"
                        class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
                        3
                    </a>
                    <a href="#"
                        class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
                        4
                    </a>
                    <span class="flex gap-1">
                        <img loading="lazy" src="public/paginationdots.png" alt=""
                            class="w-5 h-5 mt-3.5 aspect-square border-zinc-200" />
                        <a href="#"
                            class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
                            10
                        </a>
                        <a href="#"
                            class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
                            11
                        </a>
                    </span>
                    <a href="#" class="flex gap-0.5 text-zinc-400">
                        <img loading="lazy" src="public/paginationright.png" alt="Next page"
                            class="w-5 h-5 mt-3.5 ml-5" />
                        <span class="sr-only">Next page</span>
                    </a>
                </nav>
            </section>
        </main>
    </div>
</template>


<script lang="ts">
import BarChartC from '@/components/BarChart.vue'; // Adjust the path as needed
import ky from 'ky';
import { defineComponent, computed, ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import Flatpickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css'; // Optional: Use a different theme

interface Config {
    configFileName: string;
    category: string;
    tags: string[];
    reviewStatus: string;
    dateSubmitted: string;
    lastReviewed: string;
    submittedBy: {
        username: string;
        avatarUrl: string;
    };
    numOfReviews: number;
}

export default defineComponent({
    components: {
        Flatpickr,
        BarChartC,
    },
    setup() {
        const configs = ref<Config[]>([]);
        const categories = ref<string[]>([]);
        const reviewStatuses = ref<string[]>([]);
        const selectedFileName = ref('');
        const fileTypeIcon = ref('');
        const dateRange = ref(['2019/04/14', '2024/06/14']);
        const selectedCategory = ref('');
        const selectedReviewStatus = ref('');
        const searchQuery = ref('');
        const flatpickrConfig = ref({
            mode: 'range' as 'range', // Ensure type compatibility
            dateFormat: 'Y/m/d',
            defaultDate: ['2019/04/14', '2024/06/14'],
        });
        const uPlotContainer = ref<HTMLDivElement | null>(null);

        const filteredConfigs = computed(() => {
            const [startDate, endDate] = dateRange.value;
            const start = startDate ? new Date(startDate) : new Date('0000-01-01');
            const end = endDate ? new Date(endDate) : new Date('9999-12-31');

            console.log('Selected Date Range:', start, end);

            return configs.value.filter(config => {
                const matchesCategory = selectedCategory.value ? config.category === selectedCategory.value : true;
                const matchesReviewStatus = selectedReviewStatus.value ? config.reviewStatus === selectedReviewStatus.value : true;
                const matchesSearchQuery = config.configFileName.toLowerCase().includes(searchQuery.value.toLowerCase());
                const submittedDate = new Date(config.dateSubmitted);
                const matchesDateRange = submittedDate >= start && submittedDate <= end;

                return matchesCategory && matchesReviewStatus && matchesSearchQuery && matchesDateRange;
            });
        });

        const fetchConfigs = async () => {
            try {
                const response = await ky.get('/mock-config.json').json<{ configs: Config[] }>();
                configs.value = response.configs;

                const categoriesSet = new Set<string>();
                const reviewStatusesSet = new Set<string>();
                configs.value.forEach(config => {
                    categoriesSet.add(config.category);
                    reviewStatusesSet.add(config.reviewStatus);
                });

                categories.value = Array.from(categoriesSet);
                reviewStatuses.value = Array.from(reviewStatusesSet);

                console.log(categories.value, reviewStatuses.value);

            } catch (error) {
                console.error('Failed to fetch configs:', error);
            }
        };

        const triggerFileInput = () => {
            const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
            fileInput?.click();
        };

        const handleFileUpload = (event: Event) => {
            const input = event.target as HTMLInputElement;
            const file = input.files?.[0];
            if (file) {
                selectedFileName.value = file.name;
                fileTypeIcon.value = getFileTypeIcon(file.type);
                console.log('Selected file:', file);
            }
        };

        const getFileTypeIcon = (mimeType: string): string => {
            const fileIcons: Record<string, string> = {
                'application/json': '/json_icon.png',
                'text/csv': '/csv_icon.png',
                'text/plain': '/txt_icon.png',
            };

            return fileIcons[mimeType] || '';
        };

        const initChart = () => {
            const container = uPlotContainer.value;

            if (container) {
                const categories = ['HealthCare', 'Finance', 'Geography', 'Politics', 'Psychology', 'History'];
                const indices = categories.map((_, index) => index);

                const data = [
                    new Float64Array(indices),
                    new Float64Array([50, 60, 55, 70, 65, 75]),
                    new Float64Array([45, 65, 40, 55, 50, 60]),
                    new Float64Array([60, 55, 50, 65, 60, 55]),
                    new Float64Array([65, 70, 60, 45, 55, 65]),
                ];

                const opts: uPlot.Options = {
                    title: 'Accuracy',
                    width: container.clientWidth,
                    height: 300,
                    series: [
                        {},
                        { label: 'ChatGPT', stroke: 'cyan', paths: uPlot.paths.spline(), },
                        { label: 'Meta', stroke: 'purple', paths: uPlot.paths.spline(), },
                        { label: 'Anthropic', stroke: 'blue', paths: uPlot.paths.spline(), },
                        { label: 'Mistral AI', stroke: 'orange', paths: uPlot.paths.spline(), },
                    ],
                    scales: {
                        x: { time: false },
                        y: {
                            range: (): [number, number] => [30, 80],
                        },
                    },
                    axes: [
                        {
                            stroke: 'black',
                            label: 'Categories',
                            values: (_self: uPlot, ticks: number[]) => ticks.map(i => categories[i]),
                        },
                        {
                            stroke: 'black',
                            label: 'Accuracy (%)',
                        },
                    ],
                };

                new uPlot(opts, data, container);
            } else {
                console.error('uPlot container not found!');
            }
        };

        onMounted(() => {
            fetchConfigs();
            initChart();
        });

        return {
            configs,
            categories,
            reviewStatuses,
            selectedFileName,
            fileTypeIcon,
            dateRange,
            selectedCategory,
            selectedReviewStatus,
            searchQuery,
            flatpickrConfig,
            uPlotContainer,
            filteredConfigs,
            triggerFileInput,
            handleFileUpload,
            getFileTypeIcon,
            initChart,
        };
    },
});
</script>
