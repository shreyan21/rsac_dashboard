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
    <div style={{ marginBottom: "20px" }}>
      <h4 style={{ textAlign: "center" }}>{title}</h4>
      <Pie
        data={{
          labels,
          datasets: [{
            data: values,
            backgroundColor: ["#4c78a8", "#f58518", "#54a24b"]
          }]
        }}
      />
    </div>
  );
}
