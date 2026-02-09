import { Bar } from "react-chartjs-2";

export default function SarusBarChart({ charts, mode }) {
  if (!Array.isArray(charts) || charts.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        No chart data available
      </div>
    );
  }
  const allZero = charts.every(d => Number(d.sarus_count || 0) === 0);
  if (allZero) {
    return (
      <div style={emptyStyle}>
        No Sarus count recorded for the selected district.
      </div>
    );
  }

  const labels =
    mode === "site"
      ? charts.map(d => d.site)
      : charts.map(d => d.district);

  const values = charts.map(d => Number(d.sarus_count || 0));

  const barCount = charts.length;

  // 🔥 Make bars thinner automatically if many districts
  let barThickness = 16;

  if (barCount > 25) barThickness = 10;
  if (barCount > 40) barThickness = 7;
  if (barCount > 60) barThickness = 5;

  const data = {
    labels,
    datasets: [
      {
        label:
          mode === "site"
            ? "Sarus Count by Site"
            : "Sarus Count by District",
        data: values,
        backgroundColor: "#4e79a7",
        borderRadius: 3,
        barThickness: barThickness
      }
    ]
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0
        },
        grid: {
          color: "#eee"
        }
      },
      y: {
        ticks: {
          autoSkip: false,
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      }
    },

    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div
      style={{
        height: "100%",     // 🔥 fill full chart pane
        width: "100%"
      }}
    >
      <Bar data={data} options={options} />
    </div>
  );
}
const emptyStyle = {
  height: "400px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "15px",
  fontWeight: 500,
  color: "#666",
  background: "#fff",
  borderRadius: "6px"
};