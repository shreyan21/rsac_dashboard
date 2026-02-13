import { Pie } from "react-chartjs-2";

export default function SarusPieChart({ title, charts, type }) {
  if (!charts) return null;

  let labels = [];
  let values = [];

  if (type === "habitat") {
    if (!Array.isArray(charts)) return null;
    labels = charts.map(d => d.habitat);
    values = charts.map(d => d.sarus_count ?? 0);
  } else {
    labels = ["Adults", "Juvenile", "Nests"];
    values = [
      charts.adults ?? charts.adult ?? 0,
      charts.juvenile ?? 0,
      charts.nests ?? 0
    ];
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "15px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h4
        style={{
          textAlign: "center",
          color: "#003366",
          marginBottom: "10px",
          fontSize: "14px",
          fontWeight: "600"
        }}
      >
        {title}
      </h4>

      <div style={{ flex: 1 ,height: "250px"}}>
        <Pie
          data={{
            labels,
            datasets: [{
              data: values,
              backgroundColor: ["#4c78a8", "#f58518", "#54a24b"]
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { font: { size: 11 } }
              }
            }
          }}
        />
      </div>
    </div>
  );
}
