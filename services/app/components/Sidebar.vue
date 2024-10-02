<template>
  <div class="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-2xl font-bold text-blue-900 dark:text-blue-300">ethosAI</h1>
    </div>
    <nav class="mt-4">
      <ul>
        <li v-for="item in menuItems" :key="item.name" class="mb-2">
          <template v-if="!item.subitems">
            <router-link :to="item.route || '/'" class="block w-full flex items-center px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {{ item.name }}
            </router-link>
          </template>

          <template v-else>
            <button @click="toggleExpand(item)"
              class="w-full flex items-center justify-between px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              :aria-expanded="item.subitems ? item.expanded : undefined">
              <span class="flex items-center">
                <component :is="item.icon" class="w-5 h-5 mr-2" />
                {{ item.name }}
              </span>
              <ChevronDown v-if="!item.expanded" class="w-4 h-4" />
              <ChevronUp v-if="item.expanded" class="w-4 h-4" />
            </button>
            <ul v-if="item.expanded" class="ml-6 mt-1">
              <li v-for="subitem in item.subitems" :key="subitem" class="mb-1">
                <router-link :to="item.route || '/'"
                  class="block px-4 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  {{ subitem }}
                </router-link>
              </li>
            </ul>
          </template>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ChevronDown,
  ChevronUp,
  Home,
  ClipboardCheck,
  Users,
  Cpu,
  BarChart2,
  Settings
} from 'lucide-vue-next'

interface MenuItem {
  name: string
  icon: any
  subitems?: string[]
  expanded?: boolean,
  route?: string
}

const menuItems = ref<MenuItem[]>([
  { 
    name: 'Dashboard',
    icon: Home,
    route: '/dashboard'
  },
  {
    name: 'Eval Management',
    icon: ClipboardCheck,
    subitems: ['Create / edit evals', 'My evals'],
    expanded: false,
    route: '/createconfig',
  },
  {
    name: 'Audit Queue',
    icon: Users,
    expanded: false,
    route: '/auditqueue',
  },
  {
    name: 'LLM Selector',
    icon: Cpu,
    subitems: ['Select LLM Model', 'Run Evaluation'],
    expanded: false,
    route: '/llmselector',
  },
  {
    name: 'Result & Analysis',
    icon: BarChart2,
    subitems: ['Recent Results', 'Compare Models'],
    expanded: false,
    route: '/results',
  },
  {
    name: 'Settings',
    icon: Settings,
    subitems: ['Account Settings', 'Preferences'],
    expanded: false,
    route: '/settings',
  },
])

const toggleExpand = (item: MenuItem) => {
  if (item.subitems) {
    item.expanded = !item.expanded
  }
}
</script>
