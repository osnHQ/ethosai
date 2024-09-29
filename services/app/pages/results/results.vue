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

                    <div class="flex w-full h-full border border-gray-100 rounded-lg shadow-md bg-gray-50">
                        <!-- Left Column (30%) -->
                        <div class="w-1/3 p-4 space-y-4">
                            <!-- Card 1 -->
                            <div class="bg-purple-100 p-3 rounded-lg shadow-md flex items-center justify-between">
                                <div class="flex-1">
                                    <h3 class="text-md font-semibold">Average Accuracy</h3>
                                    <p class="text-xl font-bold">56%</p>
                                    <p class="text-xs text-green-600">↓ 5% since last week</p>
                                </div>
                                <div class="w-1/2 h-full ml-2">
                                    <BarChartC :barColor="'#8353E2'" />
                                </div>
                            </div>

                            <!-- Card 2 -->
                            <div class="bg-blue-100 p-3 rounded-lg shadow-md flex items-center justify-between">
                                <div class="flex-1">
                                    <h3 class="text-md font-semibold">Average Accuracy</h3>
                                    <p class="text-xl font-bold">56%</p>
                                    <p class="text-xs text-red-600">↓ 5% since last week</p>
                                </div>
                                <div class="w-1/2 h-full ml-2">
                                    <BarChartC :barColor="'#4069E5'" />
                                </div>
                            </div>

                            <!-- Card 3 -->
                            <div class="bg-red-100 p-3 rounded-lg shadow-md flex items-center justify-between">
                                <div class="flex-1">
                                    <h3 class="text-md font-semibold">Average Accuracy</h3>
                                    <p class="text-xl font-bold">56%</p>
                                    <p class="text-xs text-green-600">↓ 5% since last week</p>
                                </div>
                                <div class="w-1/2 h-full ml-2">
                                    <BarChartC :barColor="'#E05858'" />
                                </div>
                            </div>
                        </div>

                        <div class="w-2/3 p-4">
                            <div ref="uPlotContainer" class="w-full h-full bg-white" style="background-color: #fbfbfb;">
                            </div>
                        </div>
                    </div>
                </header>
                <div class="flex flex-wrap gap-5 mt-10 text-sm leading-5 items-center">
                    <div class="flex gap-2 flex-grow items-center">
                        <div
                            class="flex py-2 rounded mr-3 border border-solid bg-black bg-opacity-0 border-zinc-900 text-neutral-300 flex-grow w-52">
                            <NuxtImg loading="lazy" src="/search.png" alt="" class="w-5" />
                            <input v-model="searchQuery" type="text" placeholder="Search by Config File Names."
                                class="flex-grow outline-none focus:outline-none focus:shadow-none text-black placeholder-text-2 text-3 w-50" />
                        </div>
                        <div class="flex items-center text-zinc-900 flex-grow pl-2">
                            <select v-model="selectedLLM"
                                class="bg-white border border-solid border-zinc-900 rounded px-2 py-2 w-full md:w-auto">
                                <option value="">Filter by LLMs</option>
                                <option v-for="llm in llms" :key="llm" :value="llm">
                                    {{ llm }}
                                </option>
                            </select>
                        </div>
                        <div class="flex">
                            <label for="dateRange" class="text-[#323842]">Select date range</label>
                            <div
                                class="flex items-center mr-2 w-3/4 justify-center pr-2 py-2 bg-white rounded border border-solid border-neutral-300 text-zinc-900">
                                <Flatpickr v-model="dateRange" :config="flatpickrConfig"
                                    class="grow w-full md:w-auto outline-none focus:outline-none focus:shadow-none" />
                                <NuxtImg loading="lazy" src="/downarrow.png" alt=""
                                    class="shrink-0 w-3.5 aspect-square" />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="flex gap-5 items-start mt-3.5 text-sm leading-6 text-right text-cyan-500 max-md:flex-wrap max-md:max-w-full">
                    <NuxtImg loading="lazy" src="/question.png" alt="" class="shrink-0 w-6 aspect-square" />
                    <p class="flex-auto mt-3">
                        Total <span class="font-bold text-cyan-500">14</span> evals in the list
                    </p>
                </div>
                <div class="overflow-x-auto">
                    <table
                        class="mt-6 w-full text-sm leading-5 rounded border border-gray-100 border-solid bg-black bg-opacity-0">
                        <thead>
                            <tr class="font-semibold text-gray-600 bg-gray-50">
                                <th class="px-4 py-4 font-bold text-left">Eval ID</th>
                                <th class="px-4 py-4 font-bold text-left">Config File Name</th>
                                <th class="px-4 py-4 font-bold text-left">LLM Logo</th>
                                <th class="px-4 py-4 font-bold text-left">Status</th>
                                <th class="px-4 py-5 font-bold text-left">Last Accessed</th>
                                <th class="px-4 py-5 font-bold text-left">Accuracy</th>
                                <th class="px-4 py-4 font-bold text-left">Cost of running the eval</th>
                                <th class="px-4 py-4 font-bold text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="config in filteredConfigs" :key="config.evalID" class="bg-white">
                                <td class="px-4 py-4 font-bold">{{ config.evalID }}</td>
                                <td class="px-4 py-4">{{ config.configFileName }}</td>
                                <td class="px-4 py-4">
                                    <NuxtImg :src="config.LLMLogo" alt="LLM Logo" class="w-10 aspect-square" />
                                </td>
                                <td class="px-4 py-4">{{ config.status }}</td>
                                <td class="px-4 py-4">{{ config.lastAccessed }}</td>
                                <td class="px-4 py-4">{{ config.accuracy }}</td>
                                <td class="px-4 py-4">{{ config.costOfRunningEval }}</td>
                                <td class="px-4 py-4 text-cyan-500">
                                    <a href="#" class="hover:underline">{{ config.action }}</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <nav class="flex gap-1 self-center mt-14 max-w-full text-sm leading-5 whitespace-nowrap text-zinc-400 w-[344px] max-md:mt-10"
                    aria-label="Pagination">
                    <a href="#" class="flex gap-0.5 text-white">
                        <NuxtImg loading="lazy" src="/paginationleft.png" alt="Previous page"
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
                        <NuxtImg loading="lazy" src="/paginationdots.png" alt=""
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
                        <NuxtImg loading="lazy" src="/paginationright.png" alt="Next page"
                            class="w-5 h-5 mt-3.5 ml-5" />
                        <span class="sr-only">Next page</span>
                    </a>
                </nav>
            </section>
        </main>
    </div>
</template>


<script lang="ts">
import BarChartC from '@/components/BarChart.vue';
import ky from 'ky';
import { defineComponent, computed, ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import Flatpickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

interface Config {
    evalID: string;
    configFileName: string;
    LLMLogo: string;
    LLMName: string;
    status: string;
    lastAccessed: string;
    accuracy: string;
    costOfRunningEval: string;
    action: string;
}

export default defineComponent({
    components: {
        Flatpickr,
        BarChartC,
    },
    setup() {
        const configs = ref<Config[]>([]);
        const searchQuery = ref('');
        const dateRange = ref(['2019/04/14', '2024/06/14']);
        const selectedLLM = ref('');
        const llmLogos = ref<string[]>([]);
        const llms = ref<string[]>([]); 
        const flatpickrConfig = ref({
            mode: 'range' as 'range',
            dateFormat: 'Y/m/d',
            defaultDate: ['2019/04/14', '2024/06/14'],
        });
        const uPlotContainer = ref<HTMLDivElement | null>(null);

        const filteredConfigs = computed(() => {
            const [startDate, endDate] = dateRange.value;
            const start = startDate ? new Date(startDate) : new Date('0000-01-01');
            const end = endDate ? new Date(endDate) : new Date('9999-12-31');

            return configs.value.filter(config => {
                const matchesLLM = !selectedLLM.value || config.LLMName === selectedLLM.value;
                const matchesSearchQuery = config.configFileName
                    .toLowerCase()
                    .includes(searchQuery.value.toLowerCase());
                const accessedDate = new Date(config.lastAccessed);
                const matchesDateRange = accessedDate >= start && accessedDate <= end;

                return matchesLLM && matchesSearchQuery && matchesDateRange;
            });
        });

        const fetchConfigs = async () => {
            try {
                const response = await ky.get('/mock-config2.json').json<{ configs: Config[] }>();
                configs.value = response.configs;

                const logoSet = new Set<string>();
                const llmSet = new Set<string>(); 
                configs.value.forEach(config => {
                    logoSet.add(config.LLMLogo);
                    llmSet.add(config.LLMName); 
                });
                llmLogos.value = Array.from(logoSet);
                llms.value = Array.from(llmSet); 
            } catch (error) {
                console.error('Failed to fetch configs:', error);
            }
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
                        { label: 'ChatGPT', stroke: 'cyan', paths: uPlot.paths?.spline?.() },
                        { label: 'Meta', stroke: 'purple', paths: uPlot.paths?.spline?.() },
                        { label: 'Anthropic', stroke: 'blue', paths: uPlot.paths?.spline?.() },
                        { label: 'Mistral AI', stroke: 'orange', paths: uPlot.paths?.spline?.() },
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
            searchQuery,
            dateRange,
            flatpickrConfig,
            uPlotContainer,
            filteredConfigs,
            selectedLLM,
            llmLogos,
            llms,
            initChart,
        };
    },
});
</script>
