<template>
    <div :class="cardClasses" class="w-75 p-4 rounded-lg shadow-md">
      <h2 class="text-lg font-semibold text-gray-900 font-bold text-center mb-[-20px]">{{ title }}</h2>
      
      <div class="relative">
        <DoughnutChart 
          :percent="percent" 
          :theme="theme"  
        />
        <div class="absolute inset-0 flex flex-col items-center justify-center" style="top: 25%;">
          <span class="text-2xl font-bold">{{ percent }}%</span>
          <span class="text-gray-500">{{ completed }}/{{ total }}</span>
        </div>
      </div>
  
      <div class="flex justify-center mt-[-20px]"> 
        <button 
          :class="buttonClasses" 
          class="py-2 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import DoughnutChart from './DoughnutChart.vue';
  
  export default {
    name: 'ChartCard',
    components: {
      DoughnutChart,
    },
    props: {
      title: {
        type: String,
        default: 'Chart Title',
      },
      percent: {
        type: Number,
        required: true,
      },
      completed: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      theme: { 
        type: String,
        default: 'blue', 
      },
      buttonText: {
        type: String,
        default: 'View Report',
      },
    },
    computed: {
      cardClasses() {
        switch (this.theme) {
          case 'red':
            return 'bg-red-100 border-red-300';
          case 'green':
            return 'bg-green-100 border-green-300';
          case 'blue':
          default:
            return 'bg-cyan-100 border-cyan-300';
        }
      },
      buttonClasses() {
        switch (this.theme) {
          case 'red':
            return 'bg-red-500 hover:bg-red-600 text-white';
          case 'green':
            return 'bg-green-500 hover:bg-green-600 text-white';
          case 'blue':
          default:
            return 'bg-blue-500 hover:bg-blue-600 text-white';
        }
      },
    },
  };
  </script>
  
  