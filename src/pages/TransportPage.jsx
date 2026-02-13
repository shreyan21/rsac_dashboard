import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./TransportPage.css";
import "chart.js/auto";
import logo from "../assests/logo.jpg";



const API = "http://localhost:5000/transport";
// const API = 'http://14.139.43.117/report_samvedan/transport'


export default function TransportPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API}/dashboard`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);
  const km = n => Math.round(Number(n || 0));
  function displayLabel(label) {
    if (!label) return "";
    return label
      .replace(/\s*2010\s*Summary/i, "")
      .replace(/\s*2018\s*Summary/i, "")
      .replace(/\s*Summary/i, "")
      .trim();
  }
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
  function buildCardContent(item) {
    let content = `<div class="metric-number">${format(item.count)}</div>`;

    /* ---------- UP RTA Routes ---------- */
    if (item.rta_summary) {
      const r = item.rta_summary;
      content = `
        <div class="scroll-area">
          <div class="metric-number">${format(r.total)}</div>
          <div class="metric-title">Total Routes</div>

          <div class="column-grid">
            <div class="column">
              <div class="metric-number small">${Math.round(r.longest)} km</div>
              <div class="metric-sub">Longest</div>
            </div>
            <div class="column">
              <div class="metric-number small">${Math.round(r.shortest)} km</div>
              <div class="metric-sub">Shortest</div>
            </div>
            
          </div>

          
        </div>`;
    }
    /* ---------- Ganga Cruise Route ---------- */
    if (item.ganga_cruise) {
      const g = item.ganga_cruise;

      content = `
  <div class="scroll-area">
    <div class="metric-number">${format(Math.round(g.total_length_km))} km</div>
    <div class="metric-title">Total Navigable Length</div>

    <div class="column-grid">
      <div class="column">
        <div class="metric-number small">${format(g.total_routes)}</div>
        <div class="metric-sub">Cruise Segment(s)</div>
      </div>

      <div class="divider"></div>

      <div class="column">
        <div class="metric-number small">${Math.round(g.longest_km)} km</div>
        <div class="metric-sub">Longest Stretch</div>
      </div>
    </div>

    <div class="metric-section-title">Route</div>
    <div class="metric-sub interpretation-text">
      ${g.route_name} represents the mapped inland waterway
      cruise corridor along the Ganga river.
    </div>
  </div>`;
    }
    if (item.expressways_combined) {

      const e = item.expressways_combined;

      content = `
<div class="scroll-area">

<div class="metric-number">${format(e.total)}</div>
<div class="metric-title">Total Expressways</div>

<div class="column-grid">
  <div class="column">
    <div class="metric-number small">${Math.round(e.longest)} km</div>
    <div class="metric-sub">Longest</div>
  </div>

  <div class="column">
    <div class="metric-number small">${Math.round(e.shortest)} km</div>
    <div class="metric-sub">Shortest</div>
  </div>
</div>

<div class="metric-section-title">Total Length</div>
<div class="metric-number small">
  ${format(Math.round(e.total_length))} km
</div>

</div>`;
    }






    /* ---------- UP Roadways Routes Summary ---------- */
    if (item.statistics && item.top_depots) {
      const stats = item.statistics;

      content = `
        <div class="scroll-area">
          <div class="metric-number">${format(item.total_routes)}</div>
          <div class="metric-title">Total Routes</div>

          <div class="column-grid">
            <div class="column">
              <div class="metric-number small">${Math.round(stats.longest)} km</div>
              <div class="metric-sub">Longest</div>
            </div>
            <div class="column">
              <div class="metric-number small">${Math.round(stats.shortest)} km</div>
              <div class="metric-sub">Shortest</div>
            </div>
           
          </div>

          <div class="column-grid" style="margin-top:10px;">
            <div class="column">
              <div class="metric-section-title">Top Depots</div>
              <div class="metric-sub">
                ${item.top_depots.map(d => `${d.name}: <b>${format(d.value)}</b>`).join("<br>")}
              </div>
            </div>

            <div class="divider"></div>

            <div class="column">
              <div class="metric-section-title">Top Regions</div>
              <div class="metric-sub">
                ${item.top_regions.map(d => `${d.name}: <b>${format(d.value)}</b>`).join("<br>")}
              </div>
            </div>
          </div>
        </div>`;
    }

    /* ---------- National Highway 2010 Summary ---------- */
    if (item.national_highway_2010) {
      const nh = item.national_highway_2010;

      content = `
        <div class="scroll-area">
          <div class="metric-number">${format(Math.round(nh.total_length_km))} </div>
          <div class="metric-title">Total Network Length</div>

          <div class="column-grid">
            <div class="column">
              <div class="metric-number small">${Math.round(nh.longest_km)} </div>
              <div class="metric-sub">Longest Section</div>
            </div>
            <div class="column">
              <div class="metric-number small">${Math.round(nh.shortest_km)} km</div>
              <div class="metric-sub">Shortest Section</div>
            </div>
           
          </div>

          <div class="metric-section-title">Key Highways</div>
          <div class="metric-sub">
            ${nh.top_highways.map(h => `${h.name}: <b>${Math.round(h.value)} km</b>`).join("<br>")}
          </div>
        </div>`;
    }

    /* ---------- State Highway 2010 Summary ---------- */
    if (item.state_highway_2010) {
      const sh = item.state_highway_2010;

      content = `
        <div class="scroll-area">
          <div class="metric-number">${format(Math.round(sh.total_length_km))} km</div>
          <div class="metric-title">Total Network Length</div>

          <div class="column-grid">
            <div class="column">
              <div class="metric-number small">${Math.round(sh.longest_km)} km</div>
              <div class="metric-sub">Longest Section</div>       
            </div>
            <div class="column">
              <div class="metric-number small">${Math.round(sh.shortest_km)} km</div>
              <div class="metric-sub">Shortest Section</div>
            </div>
           
          </div>

          <div class="metric-section-title">Key Highways</div>
          <div class="metric-sub">
            ${sh.top_highways.map(h => `${h.name}: <b>${Math.round(h.value)} km</b>`).join("<br>")}
          </div>
        </div>`;
    }

    /* ---------- National Highway 2018 Summary ---------- */
    if (item.national_highway_2018) {
      const nh18 = item.national_highway_2018;
      content = `
        <div class="scroll-area">
          <div class="metric-number">${format(nh18.total_segments)}</div>
          <div class="metric-title">Mapped NH Segments</div>

          <div class="column-grid">
            <div class="column">
              <div class="metric-number small">${format(nh18.pucca_segments ?? nh18.total_segments)}</div>
              <div class="metric-sub">Pucca Road Segments</div>
            </div>
            
          </div>

          <div class="metric-section-title">Interpretation</div>
          <div class="metric-sub interpretation-text">
            Continuous pucca National Highway network digitized for 2018
            with homogeneous attributes across all segments.
          </div>
        </div>`;
    }

    /* ---------- State Highway 2018 Summary ---------- */
    if (item.state_highway_2018) {
      const sh18 = item.state_highway_2018;
      content = `
        <div class="scroll-area">
          <div class="metric-number">${format(sh18.total_segments)}</div>
          <div class="metric-title">Mapped SH Segments</div>

          <div class="column-grid">
            <div class="column">
              <div class="metric-number small">${format(sh18.pucca_segments ?? sh18.total_segments)}</div>
              <div class="metric-sub">Pucca Road Segments</div>
            </div>
           
          </div>

          <div class="metric-section-title">Interpretation</div>
          <div class="metric-sub interpretation-text">
            State Highway network represented as uniform pucca corridors,
            primarily distinguished by administrative status rather than length.
          </div>
        </div>`;
    }

    /* ---------- Railway Network 2010 ---------- */
    /* ---------- Railway Network (Length Based) ---------- */
    if (item.railway_summary) {
      const r = item.railway_summary;

      content = `
  <div class="scroll-area">
    <div class="metric-number">${format(Math.round(r.total_length))} km</div>
    <div class="metric-title">Total Railway Length</div>

    <div class="column-grid">
      <div class="column">
        <div class="metric-number small">${Math.round(r.longest)} km</div>
        <div class="metric-sub">Longest Stretch</div>
      </div>

      <div class="column">
        <div class="metric-number small">${Math.round(r.shortest)} km</div>
        <div class="metric-sub">Shortest Stretch</div>
      </div>
    </div>
  </div>
`;
    }

    /* ---------- Railway Network 2018 ---------- */
    if (item.railway_2018) {

      const b = item.railway_2018;

      content = `
<div class="scroll-area">

  <div class="metric-number">${format(Math.round(b.total_length_km))} km</div>
  <div class="metric-title">Total Railway Length</div>

  <div class="column-grid">

    <div class="column">
      <div class="metric-number small">${format(b.total_tracks)}</div>
      <div class="metric-sub">Total Tracks</div>
    </div>

    <div class="column">
      <div class="metric-number small">${format(b.broad_gauge)}</div>
      <div class="metric-sub">Broad Gauge</div>
    </div>

  </div>

  <div class="metric-section-title">Operational Status</div>
  <div class="metric-sub">
    Govt: ${format(b.government_operational)} |
    Under Construction: ${format(b.under_construction)} |
    Metro: ${format(b.metro_lines)}
  </div>

</div>
`;
    }


    /* ---------- Other Roads 2010 ---------- */
    if (item.other_roads_2010) {
      const o = item.other_roads_2010;
      content = `
        <div class="scroll-area">
          <div class="metric-number">${format(item.count)}</div>
          <div class="metric-title">Total Roads</div>
          <div class="column-grid">
            <div class="column">
              <div class="metric-number small">${format(o.pucca.total)}</div>
              <div class="metric-section-title">Pucca</div>
              <div class="metric-sub">
                City: ${format(o.pucca.city)}<br>
                District: ${format(o.pucca.district)}<br>
                Village Pakka: ${format(o.pucca.village_pakka)}
              </div>
            </div>
            <div class="divider"></div>
            <div class="column">
              <div class="metric-number small">${format(o.katchha.total)}</div>
              <div class="metric-section-title">Katchha</div>
              <div class="metric-sub">
                Footpath: ${format(o.katchha.footpath)}<br>
                Cart Track: ${format(o.katchha.cart_track)}<br>
                Village Kachha: ${format(o.katchha.village_kachha)}
              </div>
            </div>
          </div>
        </div>`;
    }

    /* ---------- Other Roads 2018 ---------- */
    if (item.other_roads) {
      const o = item.other_roads;
      content = `
        <div class="scroll-area">
          <div class="metric-number">${format(item.count)}</div>
          <div class="metric-title">Total Roads</div>
          <div class="column-grid">
            <div class="column">
              <div class="metric-number small">${format(o.pucca.total)}</div>
              <div class="metric-section-title">Pucca</div>
              <div class="metric-sub">
                City: ${format(o.pucca.city_road)}<br>
                Village Pucca: ${format(o.pucca.village_pucca)}<br>
                District: ${format(o.pucca.district_road)}
              </div>
            </div>
            <div class="divider"></div>
            <div class="column">
              <div class="metric-number small">${format(o.katchha.total)}</div>
              <div class="metric-section-title">Katchha</div>
              <div class="metric-sub">
                Footpath: ${format(o.katchha.foot_path)}<br>
                Cart Track: ${format(o.katchha.cart_track)}<br>
                Village Katchha: ${format(o.katchha.village_katchha)}
              </div>
            </div>
          </div>
        </div>`;
    }

    return content;
  }
  function buildCardHtml(item) {
    const content = buildCardContent(item);
    const friendly = item.friendly || "";
    const cleanTitle = displayLabel(item.label || friendly || "");
    return `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card-custom">
          <h6 class="fw-bold text-primary text-center">${cleanTitle}</h6>
          <div class="card-content">${content}</div>
          <div class="card-footer-label" title="${friendly}">${friendly}</div>
        </div>
      </div>
    `;
  }

  async function exportpdf() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();

    // ---------- HEADER ---------- //
    try {
      const logoBlob = await fetch(logo).then(r => r.blob());
      const logoBase64 = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(logoBlob);
      });

      pdf.addImage(logoBase64, "JPEG", 10, 10, 22, 22);
    } catch (err) { }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Remote Sensing Applications Centre, Uttar Pradesh", pdfWidth / 2, 18, { align: "center" });

    pdf.setFontSize(11);
    pdf.text("Lucknow, Uttar Pradesh", pdfWidth / 2, 25, { align: "center" });

    pdf.setFontSize(9);
    pdf.setTextColor(70);
    pdf.text(
      `Generated on: ${new Date().toLocaleString("en-IN")}`,
      pdfWidth - 10,
      32,
      { align: "right" }
    );

    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text("Transport Dataset Summary", pdfWidth / 2, 42, { align: "center" });

    let y = 50;

    // ---------- ANALYTICS SECTION WITH CHARTS IN PDF ---------- //


    // ---------- DATASET-WISE TABLE SECTION ---------- //
    const data = await fetch(`${API}/dashboard`).then(r => r.json());
    const dashboard = await fetch(`${API}/dashboard`).then(r => r.json());

    // ===== 2010–2018 ANALYTICS =====
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("2010–2018 Analytics", 14, y);
    y += 6;
    
    pdf.autoTable({
      startY: y,
      head: [["Dataset", "2010 (km)", "2018 (km)"]],
      body: [
        [
          "National Highways",
          format(dashboard.analytics.nh.y2010),
          format(dashboard.analytics.nh.y2018)
        ],
        [
          "State Highways",
          format(dashboard.analytics.sh.y2010),
          format(dashboard.analytics.sh.y2018)
        ],
        [
          "Other Roads",
          format(dashboard.analytics.other.y2010),
          format(dashboard.analytics.other.y2018)
        ],
        [
          "Railway Networks",
          format(dashboard.analytics.rail.y2010),
          format(dashboard.analytics.rail.y2018)
        ]
      ],
      theme: "striped",
      headStyles: { fillColor: [31, 59, 77], textColor: 255 }
    });
    
    y = pdf.lastAutoTable.finalY + 10;
    
    
    // ===== 2018 LAYERS =====
    pdf.setFont("helvetica", "bold");
    pdf.text("2018 Layers", 14, y);
    y += 6;
    
    pdf.autoTable({
      startY: y,
      head: [["Dataset", "Total", "Additional Info"]],
      body: [
        [
          "Expressways",
          Number(dashboard.expressways.existing.count) +
            Number(dashboard.expressways.upcoming.count),
          `Total Length: ${
            Math.round(
              Number(dashboard.expressways.existing.sum) +
              Number(dashboard.expressways.upcoming.sum)
            )
          } km`
        ],
        [
          "Ganga Cruise Route",
          `${format(dashboard.ganga.sum)}(km)`,
          "Longest Stretch: 1289 km"
        ],
        [
          "UP Roadways Routes",
          format(dashboard.roadways.count),
          `Longest: ${km(dashboard.roadways.max)} km`
        ],
        [
          "UP RTA Routes",
          format(dashboard.rta.count),
          `Longest: ${km(dashboard.rta.max)} km`
        ]
      ],
      theme: "striped",
      headStyles: { fillColor: [31, 59, 77], textColor: 255 }
    });
    

    pdf.save("RSAC_Transport_Dashboard.pdf");
  }



  return (

    <div className="transport-wrapper">

      {/* HEADER */}
      <header className="main-header">
      <img src={logo} className="rsac-logo" />
        <h2>Remote Sensing Applications Centre, Uttar Pradesh</h2>
      </header>

{/* <Header /> */}

      {/* SUB HEADER */}
      <div className="sub-header">
        <h4>TRANSPORT DATASET SUMMARY</h4>
        {/* <button
          className="btn-export"
          onClick={() => window.open(`${API}/export`, "_blank")}
        >
          📄 EXPORT PDF
        </button> */}
        <button className="btn-export" onClick={exportpdf}>EXPORT PDF</button>



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
              leftLabel="Longest(km)"
              rightValue={km(data.rta.min)}
              rightLabel="Shortest(km)"
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





