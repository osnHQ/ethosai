<template>
    <div ref="chartContainer" class="chart-container"></div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
  import ky from 'ky';
  import uPlot from 'uplot';
  import 'uplot/dist/uPlot.min.css';
  
  export default defineComponent({
    name: 'ModelScoresGraph',
    setup() {
      const chartContainer = ref(null);
      const labels = ref([]);
      const scores = ref([]);
      let uplotInstance = null;
      let tooltip = null;
  
      const createTooltip = () => {
        tooltip = document.createElement('div');
        tooltip.className = 'uplot-tooltip';
        chartContainer.value.appendChild(tooltip);
      };
  
      const renderChart = () => {
        if (typeof window === "undefined") {
          console.warn("RenderChart skipped during SSR");
          return;
        }
  
        if (!chartContainer.value || !labels.value.length || !scores.value.length) return;
  
        const xAxisIndices = labels.value.map((_, idx) => idx);
        const chartData = [xAxisIndices, [...scores.value]];
  
        if (uplotInstance) {
          uplotInstance.destroy();
        }
  
        if (!tooltip) {
          createTooltip();
        }
  
        const tooltipPlugin = {
          hooks: {
            setCursor: (u) => {
              const { left, top, idx } = u.cursor;
              if (idx !== null) {
                tooltip.style.display = 'block';
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top - 40}px`;
                tooltip.textContent = `${labels.value[idx]}: ${scores.value[idx].toFixed(2)}`;
              } else {
                tooltip.style.display = 'none';
              }
            },
          },
        };
  
        try {
          uplotInstance = new uPlot(
            {
              title: 'Average Scores of Models',
              width: chartContainer.value.offsetWidth,
              height: 400,
              scales: {
                x: { time: false },
                y: { auto: true },
              },
              axes: [
                {
                  label: 'Models',
                  values: (_, ticks) => ticks.map((tick) => labels.value[tick] || ""),
                },
                {
                  label: 'Average Score',
                },
              ],
              series: [
                {},
                {
                  label: 'Average Score',
                  stroke: '#1e90ff',
                  fill: 'rgba(30, 144, 255, 0.3)',
                  bars: { show: true, width: 0.6 },
                  points: { show: true, size: 5 },
                },
              ],
              grid: {
                x: { show: true, stroke: '#ddd', width: 1 },
                y: { show: true, stroke: '#ddd', width: 1 },
              },
              cursor: {
                show: true,
                x: true,
                y: true,
                lock: false,
              },
              plugins: [tooltipPlugin],
            },
            chartData,
            chartContainer.value
          );
        } catch (error) {
          console.error('Error rendering chart:', error);
        }
      };
  
      const fetchData = async () => {
        try {
          const response = await ky.get('http://localhost:8787/models').json();
          labels.value = response.map((model) => model.name);
          scores.value = response.map((model) => parseFloat(model.averageScore));
          nextTick(() => renderChart());
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      onMounted(() => {
        if (typeof window !== "undefined") {
          fetchData();
          window.addEventListener("resize", renderChart);
        }
      });
  
      onBeforeUnmount(() => {
        if (uplotInstance) {
          uplotInstance.destroy();
        }
        window.removeEventListener("resize", renderChart);
        if (tooltip) {
          tooltip.remove();
          tooltip = null;
        }
      });
  
      return {
        chartContainer,
      };
    },
  });
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 400px;
    position: relative;
  }
  
  .uplot-tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 5px;
    border-radius: 3px;
    pointer-events: none;
    font-size: 12px;
    white-space: nowrap;
    display: none;
  }
  </style>