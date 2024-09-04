<template>
    <div>
        <bar-chart :chart-data="chartData" :options="chartOptions" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
    name: 'BarChartC',
    components: {
        Bar,
    },
    data() {
        return {
            chartData: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Progress',
                        backgroundColor: '#6366F1',
                        data: [12, 19, 3, 5, 2, 3, 7],
                    },
                ],
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        };
    },
});
</script>