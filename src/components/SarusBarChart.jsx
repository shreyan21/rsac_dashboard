import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SarusBarChart({ charts = [], mode }) {
  if (!charts.length) return null;

  // Sort highest first
  const sorted = [...charts].sort(
    (a, b) => Number(b.sarus_count) - Number(a.sarus_count)
  );

  const MAX_LABELS = 15;

  const limited = sorted.slice(0, MAX_LABELS);

  const labels = limited.map(d =>
    (mode === "site" ? d.site : d.district)
      ?.replace(/\b\w/g, c => c.toUpperCase())
  );

  const values = limited.map(d => Number(d.sarus_count));

  const data = {
    labels,
    datasets: [
      {
        label: "Sarus Count",
        data: values,
        backgroundColor: "#0d3b66",  // professional blue
        borderRadius: 4,
        barThickness: 18
      }
    ]
  };

  const options = {
    indexAxis: "y",  // HORIZONTAL
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Sarus Count",
          font: { size: 14, weight: "bold" }
        },
        ticks: {
          font: { size: 12 }
        }
      },
      y: {
        title: {
          display: true,
          text: mode === "site" ? "Sites" : "Districts",
          font: { size: 14, weight: "bold" }
        },
        ticks: {
          font: { size: 11 }
        }
      }
    }
  };

  return (
  <div
    style={{
      height: "520px",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}
  >
    <div style={{ flex: 1 }}>
      <Bar data={data} options={options} />
    </div>

    {charts.length > MAX_LABELS && (
      <div
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#666",
          padding: "6px 0"
        }}
      >
        Showing top {MAX_LABELS} of {charts.length}{" "}
        {mode === "site" ? "sites" : "districts"}.
      </div>
    )}
  </div>
);


}
