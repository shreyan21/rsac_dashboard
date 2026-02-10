import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./TransportPage.css";
import "chart.js/auto";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const API = "http://localhost:5000/transport";

export default function TransportPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API}/dashboard`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);
  const km = n => Math.round(Number(n || 0));

  if (!data) return <div style={{ padding: 40 }}>Loading...</div>;

  const format = n =>
    Number(n || 0).toLocaleString("en-IN");

  const buildChart = (y2010, y2018) => ({
    labels: ["2010", "2018"],
    datasets: [
      {
        data: [y2010, y2018],
        backgroundColor: ["#1f3b4d", "#0b7285"],
        borderRadius: 8,
        barThickness: 18
      }
    ]
  });

const handleExport = async () => {
  const element = document.getElementById("pdf-content");

  const canvas = await html2canvas(element, {
    scale: 2
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 190;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10;

  pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("RSAC_Transport_Dashboard.pdf");
};


  return (

    <div className="transport-wrapper">

      {/* HEADER */}
      <header className="main-header">
        <img src="http://localhost:5000/images/logo.jpg" alt="RSAC Logo" />
        <h2>Remote Sensing Applications Centre, Uttar Pradesh</h2>
      </header>

      {/* SUB HEADER */}
      <div className="sub-header">
        <h4>TRANSPORT DATASET SUMMARY</h4>
        <button
  className="btn-export"
  onClick={() => window.open(`${API}/export`, "_blank")}
>
  📄 EXPORT PDF
</button>



      </div>

      <div className="main-container">

        {/* ===== ANALYTICS SECTION ===== */}
        <div className="year-section">
          <div className="year-pill">2010–2018 Analytics</div>
          <div className="year-line"></div>
        </div>

        <div className="card-grid">
          <AnalyticsCard
            title="Total length of National Highways in km"
            y2010={data.analytics.nh.y2010}
            y2018={data.analytics.nh.y2018}
          />
          <AnalyticsCard
            title="Total length of State Highways in km"
            y2010={data.analytics.sh.y2010}
            y2018={data.analytics.sh.y2018}
          />
          <AnalyticsCard
            title="Total length of other roads in km"
            y2010={data.analytics.other.y2010}
            y2018={data.analytics.other.y2018}
          />
          <AnalyticsCard
            title="Total length of Railway Networks in km"
            y2010={data.analytics.rail.y2010}
            y2018={data.analytics.rail.y2018}
          />
        </div>

        {/* ===== 2018 LAYERS ===== */}
        <div className="year-section">
          <div className="year-pill">2018 Layers</div>
          <div className="year-line"></div>
        </div>

        <div className="card-grid">

          <MetricCard title="Expressways">
            <MetricBlock
              main={
                Number(data.expressways.existing.count) +
                Number(data.expressways.upcoming.count)
              }
              label="Total Expressways"
              leftValue={
                Math.round(
                  Math.max(
                    data.expressways.existing.max,
                    data.expressways.upcoming.max
                  )
                )
              }
              leftLabel="Longest (km)"
              rightValue={
                km(
                  Math.min(
                    data.expressways.existing.min,
                    data.expressways.upcoming.min
                  )
                )
              }
              rightLabel="Shortest (km)"
              bottomValue={
                Math.round(
                  Number(data.expressways.existing.sum) +
                  Number(data.expressways.upcoming.sum)
                )
              }
              bottomLabel="Total Length (km)"
            />
          </MetricCard>



          <MetricCard title="Ganga Cruise Route">
            <MetricBlock
              main={format(data.ganga.sum)}
              label="Total Navigable Length"
              leftValue={1}
              leftLabel="Cruise Segment"
              rightValue={1289}
              rightLabel="Longest Stretch"
            />
          </MetricCard>

          <MetricCard title="UP Roadways Routes">
            <MetricBlock
              main={format(data.roadways.count)}
              label="Total Routes"
              leftValue={km(data.roadways.max)}

              leftLabel="Longest"
              rightValue={km(data.roadways.min)}
              rightLabel="Shortest"
            />

            <div className="metric-extra">
              <div>
                <div className="extra-title">Top Depots</div>
                <div className="extra-item">AYODHYA: 106</div>
                <div className="extra-item">Noida: 24</div>
                <div className="extra-item">Deoria: 21</div>
              </div>

              <div>
                <div className="extra-title">Top Regions</div>
                <div className="extra-item">Ayodhya: 106</div>
                <div className="extra-item">Gorakhpur: 55</div>
                <div className="extra-item">Meerut: 51</div>
              </div>
            </div>
          </MetricCard>


          <MetricCard title="UP RTA Routes">
            <MetricBlock
              main={format(data.rta.count)}
              label="Total Routes"
              leftValue={km(data.rta.max)}
              leftLabel="Longest"
              rightValue={km(data.rta.min)}
              rightLabel="Shortest"
            />
          </MetricCard>

        </div>

      </div>
    </div>
  );




}


/* ---------- REUSABLE COMPONENTS ---------- */

function AnalyticsCard({ title, y2010, y2018 }) {
  const format = n => Number(n || 0).toLocaleString("en-IN");

  const chartData = {
    labels: ["2010", "2018"],
    datasets: [
      {
        data: [y2010, y2018],
        backgroundColor: ["#1f3b4d", "#0b7285"],
        maxBarThickness: 22,
        categoryPercentage: 0.5,
        barPercentage: 0.5
      }
    ]

  };

  return (
    <div className="analytics-card">
      <h5>{title}</h5>

      <div className="analytics-content">
        <div>
          <p><b>2010 yr :</b> {format(y2010)}</p>
          <p><b>2018 yr :</b> {format(y2018)}</p>
        </div>

        <div className="chart-box">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: {
                    font: { size: 11 }
                  }
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(0,0,0,0.08)"
                  },
                  ticks: {
                    font: { size: 10 },
                    callback: value =>
                      Number(value).toLocaleString("en-IN")
                  }
                }
              },
              elements: {
                bar: {
                  borderRadius: 6
                }
              }
            }}

          />

        </div>
      </div>
    </div>
  );
}
function MetricCard({ title, children }) {
  return (
    <div className="metric-card">
      <h5>{title}</h5>
      {children}
    </div>
  );
}


function MetricBlock({ main, label, leftValue, leftLabel, rightValue, rightLabel, bottomLabel, bottomValue }) {
  return (
    <>
      <div>
        <div className="metric-main">{main}</div>
        <div className="metric-label">{label}</div>
      </div>

      <div className="metric-row">
        <div className="metric-col">
          <div className="value">{leftValue}</div>
          <div className="sub">{leftLabel}</div>
        </div>
        <div className="metric-col">
          <div className="value">{rightValue}</div>
          <div className="sub">{rightLabel}</div>
        </div>
      </div>

      {bottomLabel && (
        <div className="metric-bottom">
          {bottomLabel}
          <span>{bottomValue}</span>
        </div>
      )}
    </>

  );
}





