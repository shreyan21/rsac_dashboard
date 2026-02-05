import { Bar } from "react-chartjs-2";

export default function SarusBarChart({ charts }) {
  if (!Array.isArray(charts) || charts.length === 0) return null;

  return (
    <div style={{ height: "100%" }}>
      <Bar
        data={{
          labels: charts.map(d => d.district),
          datasets: [{
            label: "Sarus Count",
            data: charts.map(d => d.sarus_count ?? d.count ?? 0),
            backgroundColor: "#4e79a7"
          }]
        }}
        options={{
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              ticks: {
                autoSkip: false,   // ✅ SHOW ALL DISTRICTS
                font: { size: 10 }
              }
            }
          }
        }}
      />
    </div>
  );
}
