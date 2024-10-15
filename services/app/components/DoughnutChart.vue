<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { Doughnut } from 'vue-chartjs';
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
  
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
        default: 'blue', 
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
            rotation: -90,
            circumference: 180, 
            cutout: '70%',
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
            return ['#950909', '#ff5555'];
          case 'green':
            return ['#36a2eb', '#6eeeff']; 
          case 'blue':
          default:
            return ['#198FC7', '#6eeeff']; 
        }
      },
      getBorderColor() {
        switch (this.theme) {
          case 'red':
            return ['#950909', '#ff5555']; 
          case 'green':
            return ['#36a2eb', '#6eeeff'];
          case 'blue':
          default:
            return ['#198FC7', '#6eeeff']; 
        }
      },
    },
  };
  </script>
  
  <style scoped>
  canvas {
    height: 250px !important;
    width: 260px !important;
  }
  </style>
  