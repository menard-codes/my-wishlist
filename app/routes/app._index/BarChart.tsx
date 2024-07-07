import type { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";

interface BarChartData {
    label: string;
    data: number;
}

interface BarChartProps {
    label: string;
    title: string;
    chartData: BarChartData[];
}

export default function BarChart({ chartData, label, title }: BarChartProps) {
    const labels = chartData.map(data => data.label);
    const data: ChartData<"bar", number[], string> = {
        labels: labels,
        datasets: [{
            label,
            data: chartData.map(data => data.data),
            backgroundColor: chartData.map(_ => 'rgba(54, 162, 235, 0.2)'),
            borderColor: chartData.map(_ => 'rgb(54, 162, 235)'),
            borderWidth: 2
        }]
    };

    return (
        <Bar
            data={data}
            options={{
                plugins: {
                    title: {
                        display: true,
                        text: title
                    },
                    legend: {
                        display: false
                    }
                },
                indexAxis: 'y'
            }}
        />
    );
};