<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { Doughnut } from 'vue-chartjs';
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
  
  // Register necessary chart components
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  export default {
    name: 'DoughnutChart',
    props: {
      percent: {
        type: Number,
        required: true,
      },
      theme: {
        type: String,
        default: 'blue', // Default theme is 'blue'
      },
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        const ctx = this.$refs.chartCanvas.getContext('2d');
        const chartData = {
          datasets: [
            {
              data: [this.percent, 100 - this.percent],
              backgroundColor: this.getBackgroundColor(),
              borderColor: this.getBorderColor(),
              borderWidth: 2,
            },
          ],
        };
  
        new ChartJS(ctx, {
          type: 'doughnut',
          data: chartData,
          options: {
            rotation: -90, // Rotate to make it a half circle
            circumference: 180, // Only show 180 degrees
            cutout: '70%', // Adjust the inner radius for a donut effect
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
          },
        });
      },
      getBackgroundColor() {
        switch (this.theme) {
          case 'red':
            return ['#950909', '#ff5555']; // Example red colors
          case 'green':
            return ['#36a2eb', '#6eeeff']; // Example green colors
          case 'blue':
          default:
            return ['#198FC7', '#6eeeff']; // Default blue colors
        }
      },
      getBorderColor() {
        switch (this.theme) {
          case 'red':
            return ['#950909', '#ff5555']; // Example red border colors
          case 'green':
            return ['#36a2eb', '#6eeeff']; // Example green border colors
          case 'blue':
          default:
            return ['#198FC7', '#6eeeff']; // Default blue border colors
        }
      },
    },
  };
  </script>
  
  <style scoped>
  canvas {
    height: 250px !important;
    width: 260px !important; /* Increase width for semi-circle */
  }
  </style>
  