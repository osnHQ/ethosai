<template>
   <div class="flex h-screen bg-white">
    <aside
      :class="{
        'hidden': !isSidebarOpen && isMobile,
        'block': isSidebarOpen || !isMobile,
        'fixed': true,
        'inset-y-0 left-0': true,
        'z-30': true,
        'min-h-screen': true,
        'transition-transform transform md:translate-x-0': true
      }"
      class="w-64 bg-white shadow-lg md:block"
    >
      <Sidebar @toggleSidebar="toggleSidebar" />
    </aside>

    <div v-if="isSidebarOpen && isMobile" class="fixed inset-0 bg-black opacity-30 z-20" @click="toggleSidebar"></div>

    
    <main class="flex-1 ml-64 overflow-auto p-7"> 
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white shadow md:py-4 md:px-6">
        <div class="flex items-center w-full md:w-auto">
          <button @click="toggleSidebar"
            class="md:hidden text-gray-700 focus:outline-none mr-4 transition-colors duration-200 hover:text-gray-900"
            aria-label="Toggle Sidebar">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h1 class="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
              Audit Queue
              <img loading="lazy" src="/loading.png" alt="Loading" class="w-10 h-10" />
            </h1>
            <p class="mt-1 text-gray-500 text-md">
              Comprehensive list of community-generated config files and audits
            </p>
          </div>
        </div>

        <div class="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <button @click="goToCreateConfig"
            class="w-full md:w-auto px-6 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg shadow hover:bg-blue-600 transition duration-200 flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Config
          </button>

          <div class="w-full md:w-auto flex flex-col items-start mt-0 md:mt-5">
            <label
              class="w-full md:w-auto flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-orange-600 rounded-lg shadow hover:bg-orange-500 transition duration-200 cursor-pointer">
              <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Config File
              <input ref="fileInput" type="file" accept=".json,.csv,.txt" @change="handleFileUpload" class="hidden" />
            </label>
            <div v-if="selectedFileName" class="mt-2 text-gray-600 text-sm flex items-center">
              <NuxtImg :src="getFileTypeIcon(selectedFileType)" alt="File Type Icon" class="w-6 h-6 mr-2" />
              Selected file: <span class="font-medium">{{ selectedFileName }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Supported formats: JSON, CSV, TXT
            </p>
          </div>
        </div>
      </header>

      <div class="flex flex-col md:flex-row justify-between items-center p-6 bg-white shadow">
        <div class="flex items-center space-x-2">
          <span class="text-gray-700 font-medium">View:</span>
          <button @click="setView('table')" :class="viewMode === 'table' ? activeButtonClass : inactiveButtonClass"
            aria-label="Table View"
            class="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h18v3H3V3zm0 7h18v3H3v-3zm0 7h18v3H3v-3z" />
            </svg>
          </button>
          <button @click="setView('grid')" :class="viewMode === 'grid' ? activeButtonClass : inactiveButtonClass"
            aria-label="Grid View"
            class="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h6v6H4V4zm0 8h6v6H4v-6zm8-8h6v6h-6V4zm0 8h6v6h-6v-6z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex flex-col p-6 bg-white shadow mb-6">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
          <input v-model="searchQuery" type="text"
            class="flex-grow md:flex-shrink-0 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
            placeholder="Search configurations..." @input="debounceFilter" />

          <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <select v-model="selectedCategory"
              class="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              @change="filterConfigs">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>

            <select v-model="selectedReviewStatus"
              class="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              @change="filterConfigs">
              <option value="">All Statuses</option>
              <option v-for="status in reviewStatuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>

          </div>

          <div class="flex items-center gap-2 w-full md:w-auto">
            <label class="text-gray-700 text-sm font-medium">Date Range:</label>
            <Flatpickr v-model="dateRange" :config="flatpickrConfig"
              class="w-full md:w-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col p-6">
        <div v-if="isLoading" class="flex justify-center items-center h-full">
          <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>

        <div v-if="error" class="text-red-500 text-center mb-4">
          {{ error }}
        </div>

        <section v-if="viewMode === 'table'" class="overflow-x-auto">
          <table class="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead class="bg-gray-100">
              <tr>
                <th
                  class="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  @click="sortBy('name')">
                  Name
                  <SortIcon sortKey="name" :currentSortKey="sortKey" :sortOrder="sortOrder" />
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  @click="sortBy('category')">
                  Category
                  <SortIcon sortKey="category" :currentSortKey="sortKey" :sortOrder="sortOrder" />
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  @click="sortBy('tags')">
                  Tags
                  <SortIcon sortKey="tags" :currentSortKey="sortKey" :sortOrder="sortOrder" />
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  @click="sortBy('reviewStatus')">
                  Status
                  <SortIcon sortKey="reviewStatus" :currentSortKey="sortKey" :sortOrder="sortOrder" />
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  @click="sortBy('dateSubmitted')">
                  Submitted
                  <SortIcon sortKey="dateSubmitted" :currentSortKey="sortKey" :sortOrder="sortOrder" />
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  @click="sortBy('lastReviewed')">
                  Last Reviewed
                  <SortIcon sortKey="lastReviewed" :currentSortKey="sortKey" :sortOrder="sortOrder" />
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  @click="sortBy('submittedBy')">
                  Submitted By
                  <SortIcon sortKey="submittedBy" :currentSortKey="sortKey" :sortOrder="sortOrder" />
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  @click="sortBy('numOfReviews')">
                  Reviews
                  <SortIcon sortKey="numOfReviews" :currentSortKey="sortKey" :sortOrder="sortOrder" />
                </th>
                <th class="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="config in paginatedConfigs" :key="config.id"
                class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ config.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ config.category }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                  {{ config.tags.join(', ') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="statusClass(config.reviewStatus)"
                    class="px-3 py-1 text-xs font-semibold text-white rounded-full">
                    {{ config.reviewStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(config.dateSubmitted) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(config.lastReviewed) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ config.submittedBy.username }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ config.numOfReviews }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button @click="viewDetails(config.id)" class="text-blue-600 hover:text-blue-900 font-medium text-sm">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          <div v-for="config in paginatedConfigs" :key="config.id" class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-bold text-gray-800 mb-2">{{ config.name }}</h2>
              <p class="text-gray-600 mb-1">Category: <span class="font-semibold">{{ config.category }}</span></p>
              <p class="text-gray-600 mb-1">Tags: <span class="font-semibold">{{ config.tags.join(', ') }}</span></p>
              <p class="text-gray-600 mb-1">Status: <span :class="statusClass(config.reviewStatus)" class="font-semibold">{{ config.reviewStatus }}</span></p>
              <p class="text-gray-600 mb-1">Submitted: <span class="font-semibold">{{ formatDate(config.dateSubmitted) }}</span></p>
              <p class="text-gray-600 mb-1">Last Reviewed: <span class="font-semibold">{{ formatDate(config.lastReviewed) }}</span></p>
              <p class="text-gray-600 mb-1">Submitted By: <span class="font-semibold">{{ config.submittedBy.username }}</span></p>
              <p class="text-gray-600 mb-4">Reviews: <span class="font-semibold">{{ config.numOfReviews }}</span></p>
              <button @click="viewDetails(config.id)" class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200">View</button>
            </div>
          </div>
        </section>
        

        <div class="flex justify-between items-center mt-6">
          <div class="flex items-center space-x-2">
            <span class="text-gray-700 text-sm">Items per page:</span>
            <select v-model="itemsPerPage"
              class="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="changePage(1)">
              <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>

            <span class="text-gray-700 text-sm">
              Page {{ currentPage }} of {{ totalPages }}
            </span>

            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import ky from 'ky'
import Flatpickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'

const router = useRouter()
const isSidebarOpen = ref(false)
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

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

const isLocalhost =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
const apiUrl = isLocalhost
  ? 'http://localhost:8787/'
  : 'https://ethos.lulz.workers.dev/'

const configs = ref<Config[]>([])
const selectedFileName = ref('')
const selectedFileType = ref('')
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedReviewStatus = ref('')
const categories = ref<string[]>([])
const reviewStatuses = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const filteredConfigs = ref<Config[]>([])

const dateRange = ref<Date[]>([])

const flatpickrConfig = {
  mode: 'range' as const,
  dateFormat: 'Y-m-d',
}

let debounceTimer: ReturnType<typeof setTimeout> | undefined = undefined
const debounceFilter = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => filterConfigs(), 300)
}

const isLoading = ref(false)
const error = ref('')

const fetchConfigs = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await ky.get(`${apiUrl}configs`).json<Config[]>()
    configs.value = response

    categories.value = Array.from(
      new Set(response.map((config) => config.category))
    )
    reviewStatuses.value = Array.from(
      new Set(response.map((config) => config.reviewStatus))
    )
    filterConfigs()
  } catch (err) {
    console.error('Error fetching configs:', err)
    error.value = 'Failed to load configurations. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input?.files?.[0]) {
    selectedFileName.value = input.files[0].name
    selectedFileType.value = input.files[0].type
  }
}

const getFileTypeIcon = (mimeType: string): string => {
  const fileIcons: Record<string, string> = {
    'application/json': '/json_icon.png',
    'text/csv': '/csv_icon.png',
    'text/plain': '/txt_icon.png',
  };

  return fileIcons[mimeType] || '';
}

const matchesCriteria = (config: Config) => {
  const matchesCategory =
    !selectedCategory.value || config.category === selectedCategory.value
  const matchesStatus =
    !selectedReviewStatus.value ||
    config.reviewStatus === selectedReviewStatus.value
  const matchesSearch =
    !searchQuery.value ||
    config.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  const matchesDateRange =
    !dateRange.value.length ||
    (new Date(config.dateSubmitted) >= dateRange.value[0] &&
      new Date(config.dateSubmitted) <= dateRange.value[1])
  return matchesCategory && matchesStatus && matchesSearch && matchesDateRange
}

const filterConfigs = () => {
  filteredConfigs.value = configs.value.filter(matchesCriteria)
  applySorting()
  currentPage.value = 1
}

const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  applySorting()
}

const applySorting = () => {
  if (!sortKey.value) return

  filteredConfigs.value.sort((a, b) => {
    let aValue: any = a[sortKey.value as keyof Config]
    let bValue: any = b[sortKey.value as keyof Config]

    if (sortKey.value === 'submittedBy') {
      aValue = a.submittedBy.username
      bValue = b.submittedBy.username
    } else if (sortKey.value === 'tags') {
      aValue = a.tags.join(', ')
      bValue = b.tags.join(', ')
    } else if (sortKey.value === 'dateSubmitted' || sortKey.value === 'lastReviewed') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
}

const currentPage = ref(1)
const itemsPerPage = ref(10)
const pageSizes = [10, 20, 50, 100]

const totalPages = computed(() => {
  return Math.ceil(filteredConfigs.value.length / itemsPerPage.value) || 1
})

const paginatedConfigs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredConfigs.value.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    'Approved': 'bg-green-500',
    'Pending': 'bg-yellow-500',
    'Rejected': 'bg-red-500',
  }
  return classes[status] || 'bg-gray-500'
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const viewDetails = (id: number) => {
  // router.push({ name: 'configDetails', params: { id } })
}

const goToCreateConfig = () => {
  router.push({ name: 'createconfig' })
}

type ViewMode = 'grid' | 'table'
const viewMode = ref<ViewMode>('table')

const setView = (mode: ViewMode) => {
  viewMode.value = mode
}

const activeButtonClass = 'text-blue-600 bg-gray-200 rounded'
const inactiveButtonClass = 'text-gray-600 hover:bg-gray-100 rounded'

onMounted(fetchConfigs)

watch([configs, selectedCategory, selectedReviewStatus, searchQuery, dateRange], () => {
  filterConfigs()
})
</script>

<style scoped></style>
