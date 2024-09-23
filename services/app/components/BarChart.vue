<template>
    <div>
        <canvas ref="barChartCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { Chart } from 'chart.js/auto';

// Accept the color as a prop
const props = defineProps({
    barColor: {
        type: String,
        default: 'black'  
    }
});

const barChartCanvas = ref(null);

onMounted(() => {
    const ctx = barChartCanvas.value.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Frequency',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: props.barColor, 
                borderColor: props.barColor,
                borderWidth: 0
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                },
            }
        }
    });
});
</script>
