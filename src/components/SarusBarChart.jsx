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
  const totalCount = charts.reduce(
    (sum, item) => sum + Number(item.sarus_count || 0),
    0
  );
  
  if (totalCount === 0) {
    return (
      <div
        style={{
          height: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9fafc",
          borderRadius: "10px",
          border: "1px solid #e2e8f0"
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#003366",
            marginBottom: "8px"
          }}
        >
          No Sarus Recorded
        </div>
  
        <div
          style={{
            fontSize: "14px",
            color: "#555"
          }}
        >
          The total Sarus count is zero for the selected criteria.
        </div>
      </div>
    );
  }
  
  
  // Sort highest first
  const sorted = [...charts].sort(
    (a, b) => Number(b.sarus_count) - Number(a.sarus_count)
  );

  const MAX_LABELS = 20;

  const limited = sorted.slice(0, MAX_LABELS);

  const labels = limited.map(d =>
    (d.district || "")
      .replace(/\b\w/g, c => c.toUpperCase())
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

  const maxValue = Math.max(...values);

const options = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      beginAtZero: true,
      suggestedMax: Math.ceil(maxValue * 1.2),   // 👈 fixed scaling
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
        text: mode === "habitat" ? "Habitat" : "Districts",
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
      flex: 1,
      display: "flex",
      flexDirection: "column"
    }}
  >
    <div style={{ flex: 1 }}>
      <Bar data={data} options={options} />
    </div>

    <div
  style={{
    textAlign: "center",
    fontSize: "13px",
    color: "#444",
    padding: "10px 0",
    fontWeight: 500
  }}
>
  {mode === "district"
    ? "Showing Top Districts"
    : "Showing Top Habitats"}
</div>



  </div>
);



}
