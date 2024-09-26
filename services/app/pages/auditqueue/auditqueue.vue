<template>
  <div class="w-full relative shadow bg-white flex items-start justify-end text-left text-base text-dimgray font-inter">
    <main class="flex-1 flex flex-col items-start justify-start pt-6 px-0 pb-0 max-w-280">
      <section
        class="flex flex-col px-8 pt-8 pb-3.5 mt-10 w-full bg-white rounded shadow-sm max-w-[1676px] max-md:px-5 max-md:max-w-full">
        <header class="max-md:max-w-full">
          <div class="flex gap-5 max-md:flex-col max-md:gap-0">
            <div class="flex flex-col w-[81%] max-md:ml-0 max-md:w-full">
              <div class="flex flex-col max-md:mt-10 max-md:max-w-full">
                <div class="flex gap-5 justify-between px-0.5 w-full max-md:flex-wrap max-md:max-w-full">
                  <h1
                    class="flex gap-5 self-start text-3xl leading-10 text-zinc-900 max-md:flex-wrap max-md:max-w-full">
                    <span class="flex-auto">Audit Queue</span>
                    <NuxtImg loading="lazy" src="/loading.png" alt="" class="w-10" />
                  </h1>
                  <button class="justify-center px-6 py-2 text-lg leading-7 text-white bg-blue-500 rounded max-md:px-5"
                    @click="goToCreateConfig">
                    Add a new config manually
                  </button>
                </div>
                <p class="mt-2 text-base leading-7 text-neutral-800 max-md:max-w-full">
                  List of all community generated config files and audits
                </p>
              </div>
            </div>
            <div class="flex flex-col ml-5 w-[35%] max-md:ml-0 max-md:w-full">
              <div class="flex flex-col grow max-md:mt-10">
                <button @click="triggerFileInput"
                  class="flex items-center justify-center px-2 py-2 text-lg leading-7 text-white bg-orange-500 rounded max-md:px-5">
                  <svg class="mr-2 h-5 w-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  Or Upload a config file here
                </button>

                <div class="flex flex-row gap-3 items-center mt-3">
                  <div v-if="fileTypeIcon" class="mt-2">
                    <NuxtImg :src="fileTypeIcon" alt="File Type Icon"
                      class="w-16 h-16 object-cover border border-gray-300 rounded-md" />
                  </div>
                  <p v-if="selectedFileName" class="mt-2 text-gray-700 dark:text-gray-300">Selected file: {{
                    selectedFileName }}
                  </p>
                </div>
                <input ref="fileInput" type="file" accept=".json,.csv,.txt" style="display: none;"
                  @change="handleFileUpload" />

                <p class="mt-3 text-xs leading-5 text-zinc-700">JSON, CSV or TXT supported</p>
                <a href="#" class="mt-3.5 text-sm leading-5 text-blue-500 underline">
                  Download an example JSON format
                </a>
              </div>
            </div>
          </div>
        </header>
        <div class="flex flex-wrap gap-5 mt-10 text-sm leading-5 items-center">
          <div class="flex gap-2 flex-grow items-center">
            <div
              class="flex py-2 rounded mr-3 border border-solid bg-black bg-opacity-0 border-zinc-900 text-neutral-300 flex-grow w-52">
              <NuxtImg loading="lazy" src="/search.png" alt="" class="w-5" />
              <input v-model="searchQuery" type="text"
                placeholder="Search for the configurations here (name, tags, category etc.)"
                class="flex-grow outline-none focus:outline-none focus:shadow-none text-black placeholder-text-2 text-3 w-50" />
            </div>
            <div class="flex">
              <label for="dateRange" class="text-[#323842] ml-5">Select date range</label>
              <div
                class="flex items-center mr-2 w-3/4 justify-center pr-2 py-2 bg-white rounded border border-solid border-neutral-300 text-zinc-900">
                <Flatpickr v-model="dateRange" :config="flatpickrConfig"
                  class="grow w-full md:w-auto outline-none focus:outline-none focus:shadow-none" />

                <NuxtImg loading="lazy" src="/downarrow.png" alt="" class="shrink-0 w-3.5 aspect-square" />
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

            <!-- Review Status Filter -->
            <select v-model="selectedReviewStatus"
              class="bg-white border border-solid border-zinc-900 rounded px-2 py-2 w-full md:w-auto">
              <option value="">Filter by status (audited, unaudited, under rev)</option>
              <option v-for="status in reviewStatuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>
        </div>


        <div
          class="flex gap-5 items-start mt-3.5 text-sm leading-6 text-right text-cyan-500 max-md:flex-wrap max-md:max-w-full">
          <NuxtImg loading="lazy" src="/question.png" alt="" class="shrink-0 w-6 aspect-square" />
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
                <th class="px-3.5 py-3.5 font-bold text-left">Date <span class="font-bold">Submitted</span></th>
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
                    <span v-for="tag in config.tags" :key="tag" class="px-2 py-2.5 bg-sky-50 rounded-2xl">{{ tag
                      }}</span>
                  </div>
                </td>
                <td class="px-4 py-12">{{ config.reviewStatus }}</td>
                <td class="px-4 py-12">{{ config.dateSubmitted }}</td>
                <td class="px-4 py-12">{{ config.lastReviewed }}</td>
                <td class="px-4 py-10">
                  <div class="flex gap-2">
                    <NuxtImg :src="config.submittedBy.avatarUrl" alt="Avatar" class="w-9 aspect-square" />
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
        <nav
          class="flex gap-1 self-center mt-14 max-w-full text-sm leading-5 whitespace-nowrap text-zinc-400 w-[344px] max-md:mt-10"
          aria-label="Pagination">
          <a href="#" class="flex gap-0.5 text-white">
            <NuxtImg loading="lazy" src="/paginationleft.png" alt="Previous page" class="w-5 h-5 mt-3.5 mr-2" />
            <span class="sr-only">Previous page</span>
          </a>
          <a href="#" aria-current="page" class="justify-center items-start px-4 py-3.5 bg-cyan-500 rounded text-white">
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
            <NuxtImg loading="lazy" src="/paginationright.png" alt="Next page" class="w-5 h-5 mt-3.5 ml-5" />
            <span class="sr-only">Next page</span>
          </a>
        </nav>
      </section>
    </main>
  </div>
</template>


<script lang="ts">
import ky from 'ky';
import { defineComponent, computed } from 'vue';
import Flatpickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css'; 

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
    Flatpickr
  },
  data() {
    return {

      configs: [] as Config[],
      categories: [] as string[],
      reviewStatuses: [] as string[],
      selectedFileName: '',
      fileTypeIcon: '',
      dateRange: ['2019/04/14', '2024/06/14'], 
      selectedCategory: '',
      selectedReviewStatus: '',
      searchQuery: '',
      flatpickrConfig: {
        mode: 'range',
        dateFormat: 'Y/m/d',
        defaultDate: ['2019/04/14', '2024/06/14'],
      } as Record<string, any>
    };
  },

  computed: {
    filteredConfigs() {
      const [startDate, endDate] = this.dateRange;
    
    const start = startDate ? new Date(startDate) : new Date('0000-01-01');
    const end = endDate ? new Date(endDate) : new Date('9999-12-31');


      return this.configs.filter(config => {
        const matchesCategory = this.selectedCategory ? config.category === this.selectedCategory : true;
        const matchesReviewStatus = this.selectedReviewStatus ? config.reviewStatus === this.selectedReviewStatus : true;
        const matchesSearchQuery = config.configFileName.toLowerCase().includes(this.searchQuery.toLowerCase());
        const submittedDate = new Date(config.dateSubmitted);
        const matchesDateRange = submittedDate >= start && submittedDate <= end;

        return matchesCategory && matchesReviewStatus && matchesSearchQuery && matchesDateRange;
      });
    }
  },
  created() {
    this.fetchConfigs();
  },
  methods: {
    async fetchConfigs() {
      try {
        const response = await ky.get('/mock-config.json').json<{ configs: Config[] }>();
        this.configs = response.configs;

        const categoriesSet = new Set<string>();
        const reviewStatusesSet = new Set<string>();
        this.configs.forEach(config => {
          categoriesSet.add(config.category);
          reviewStatusesSet.add(config.reviewStatus);
        });

        this.categories = Array.from(categoriesSet);
        this.reviewStatuses = Array.from(reviewStatusesSet);


      } catch (error) {
        console.error('Failed to fetch configs:', error);
      }
    },

    goToCreateConfig(this: any) {
      this.$router.push({ name: 'createconfig' });
    },

    triggerFileInput() {
      const fileInput = this.$refs.fileInput as HTMLInputElement | null;
      fileInput?.click();
    },

    handleFileUpload(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (file) {
        this.selectedFileName = file.name;
        this.fileTypeIcon = this.getFileTypeIcon(file.type);
      }
    },

    getFileTypeIcon(mimeType: string): string {
      const fileIcons: Record<string, string> = {
        'application/json': '/json_icon.png',
        'text/csv': '/csv_icon.png',
        'text/plain': '/txt_icon.png',
      };

      return fileIcons[mimeType] || '';
    },

  },
});
</script>