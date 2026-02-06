import { Bar } from "react-chartjs-2";

export default function SarusBarChart({ charts, mode }) {
  if (!Array.isArray(charts) || charts.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        No chart data available
      </div>
    );
  }

  const labels =
    mode === "site"
      ? charts.map(d => d.site)
      : charts.map(d => d.district);

  const values = charts.map(d =>
    Number(d.sarus_count || 0)
  );

  return (
    <div style={{ height: "100%" }}>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label:
                mode === "site"
                  ? "Sarus Count by Site"
                  : "Sarus Count by District",
              data: values,
              backgroundColor: "#4e79a7"
            }
          ]
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
                autoSkip: false,
                font: { size: 10 }
              }
            }
          }
        }}
      />
    </div>
  );
}
