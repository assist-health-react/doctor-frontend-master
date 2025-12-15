import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ReportChart = ({ reports, filters }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Get the context
    const ctx = chartRef.current.getContext('2d');

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: reports.map(report => new Date(report.date).toLocaleDateString()),
        datasets: [{
          label: `${filters.type || 'All'} Reports`,
          data: reports.map(report => report.count),
          borderColor: 'rgb(79, 70, 229)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Report Trends'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [reports, filters]);

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <div className="h-96">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ReportChart; 