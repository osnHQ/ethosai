<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <aside
      :class="{'hidden': !isSidebarOpen, 'block': isSidebarOpen, 'fixed': true, 'md:relative': true, 'md:block': true}"
      class="w-full md:w-64 h-full bg-white shadow-lg z-10"
    >
      <Sidebar @toggleSidebar="toggleSidebar" />
    </aside>

    <main class="flex-1 flex flex-col p-4 md:p-8 bg-gray-50 overflow-y-auto">
      <section class="w-full bg-white shadow-md rounded-lg p-4 md:p-6 mb-8">
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="w-full md:w-3/4">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-4">
              <span>Audit Queue</span>
              <NuxtImg loading="lazy" src="/loading.png" alt="Loading" class="w-8 md:w-10" />
            </h1>
            <p class="mt-2 text-sm md:text-base text-gray-600">List of all community-generated config files and audits</p>
          </div>

          <div class="w-full md:w-1/3 flex flex-col gap-3">
            <button
              @click="goToCreateConfig"
              class="w-full px-4 py-2 text-sm md:text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-200"
            >
              Add a new config manually
            </button>

            <button
              @click="triggerFileInput"
              class="w-full flex items-center justify-center px-4 py-2 text-sm md:text-base font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-400 transition duration-200"
            >
              <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload a config file
            </button>
            <input ref="fileInput" type="file" accept=".json,.csv,.txt" @change="handleFileUpload" class="hidden" />
            <div v-if="selectedFileName" class="text-gray-600 text-sm md:text-base">Selected file: {{ selectedFileName }}</div>
            <p class="text-xs md:text-sm text-gray-500">JSON, CSV, or TXT files supported</p>
          </div>
        </header>
      </section>

      <section class="w-full mb-8 bg-white shadow-md rounded-lg p-4 md:p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <input
            v-model="searchQuery"
            type="text"
            class="flex-grow p-2 md:p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for configurations"
            @input="debounceFilter"
          />

          <div class="flex gap-4">
            <select
              v-model="selectedCategory"
              class="p-2 md:p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="filterConfigs"
            >
              <option value="">Filter by category</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>

            <select
              v-model="selectedReviewStatus"
              class="p-2 md:p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="filterConfigs"
            >
              <option value="">Filter by status</option>
              <option v-for="status in reviewStatuses" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>

          <div class="flex gap-3 items-center">
            <label class="text-sm md:text-base text-gray-700">Date Range</label>
            <Flatpickr
              v-model="dateRange"
              :config="flatpickrConfig"
              class="p-2 md:p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      <section class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="config in filteredConfigs" :key="config.id" class="bg-white shadow-md rounded-lg p-4 md:p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg md:text-xl font-semibold text-gray-800">{{ config.name }}</h2>
            <span class="px-2 py-1 text-sm text-white bg-green-500 rounded-lg">{{ config.reviewStatus }}</span>
          </div>
          <div class="text-gray-600">
            <p><strong>Category:</strong> {{ config.category }}</p>
            <p><strong>Tags:</strong> <span class="text-blue-500">{{ config.tags.join(', ') }}</span></p>
            <p><strong>Submitted:</strong> {{ new Date(config.dateSubmitted).toLocaleDateString() }}</p>
            <p><strong>Last Reviewed:</strong> {{ new Date(config.lastReviewed).toLocaleDateString() }}</p>
            <p><strong>Submitted by:</strong> {{ config.submittedBy.username }}</p>
            <p><strong>Reviews:</strong> {{ config.numOfReviews }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ky from 'ky'
import Flatpickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

interface SubmittedBy {
  username: string
}

interface Config {
  id: number
  name: string
  category: string
  tags: string[]
  reviewStatus: string
  dateSubmitted: string
  lastReviewed: string
  submittedBy: SubmittedBy
  numOfReviews: number
}

const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
const apiUrl = isLocalhost ? 'http://localhost:8787/' : 'https://ethos.lulz.workers.dev/'

const configs = ref<Config[]>([])
const selectedFileName = ref('')
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedReviewStatus = ref('')
const categories = ref<string[]>([])
const reviewStatuses = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const filteredConfigs = ref<Config[]>([])

const dateRange = ref([new Date(), new Date()])
const flatpickrConfig = {
  mode: 'range' as const,
  dateFormat: 'Y-m-d',
}

let debounceTimer: ReturnType<typeof setTimeout> | undefined = undefined
const debounceFilter = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => filterConfigs(), 300)
}

const fetchConfigs = async () => {
  try {
    const response = await ky.get(`${apiUrl}configs`).json<Config[]>()
    configs.value = response

    categories.value = Array.from(new Set(response.map(config => config.category)))
    reviewStatuses.value = Array.from(new Set(response.map(config => config.reviewStatus)))
    filterConfigs()
  } catch (error) {
    console.error('Error fetching configs:', error)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input?.files?.[0]) {
    selectedFileName.value = input.files[0].name
  }
}

const matchesCriteria = (config: Config) => {
  return (
    (!selectedCategory.value || config.category === selectedCategory.value) &&
    (!selectedReviewStatus.value || config.reviewStatus === selectedReviewStatus.value) &&
    (!searchQuery.value || config.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
}

const filterConfigs = () => {
  filteredConfigs.value = configs.value.filter(matchesCriteria)
}

const goToCreateConfig = () => {
  router.push({ name: 'createconfig' })
}

onMounted(fetchConfigs)
</script>
