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
      minHeight: "480px",          // fixed same height for both
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"        // important
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

    <div
      style={{
        flex: 1,
        position: "relative",
        height: "380px",
      }}
    >
      <Pie
        data={{
          labels,
          datasets: [{
            data: values,
            backgroundColor: [
              "#4c78a8",
              "#f58518",
              "#54a24b",
              "#72b7b2",
              "#e45756",
              "#b279a2",
              "#ff9da6",
              "#9d755d",
              "#bab0ac"
            ]
          }]
        }}
       options={{
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 10
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: { size: 11 },
        boxWidth: 14,
        padding: 8,
        usePointStyle: true
      },
      maxHeight: 70   // 👈 IMPORTANT: restrict legend height
    }
  }
}}

      />
    </div>
  </div>
);


}
