import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import SarusBarChart from "../components/SarusBarChart";
import SarusPieChart from "../components/SarusPieChart";
import SarusTable from "../components/SarusTable";
import Pagination from "../components/Pagination";
import "../styles/app.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assests/logo.jpg";  // add this at top

const API = "http://localhost:5000";
// const API = 'http://14.139.43.117/report_samvedan'

export default function SarusReport() {
  const [params] = useSearchParams();
  const table = params.get("table");

  const [rows, setRows] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [charts, setCharts] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [district, setDistrict] = useState("");

  const isLucknow = table === "sarus_lucknow_population";

  /* ================= FETCH DISTRICTS ================= */

  useEffect(() => {
    if (!table) return;

    fetch(`${API}/districts?table=${table}`)
      .then(res => res.json())
      .then(setDistricts);
  }, [table]);

  /* ================= FETCH REPORT ================= */

  useEffect(() => {
    if (!table) return;

    const q = new URLSearchParams();
    q.append("table", table);

    if (!isLucknow) {
      q.append("page", page);
      q.append("per_page", perPage);
    }

    if (district) {
      q.append("district", district);
    }

    fetch(`${API}/report?${q.toString()}`)
      .then(res => res.json())
      .then(data => {
        setRows(data.rows || []);
        setTotalRows(data.totalRows || 0);
        setTotal(data.total || 0);
        setCharts(data.charts || {});
      });

  }, [table, page, perPage, district]);

  const totalPages = isLucknow ? 1 : Math.ceil(totalRows / perPage);

  /* ================= PDF EXPORT ================= */

  const handlePdfExport = async () => {

    const q = new URLSearchParams({ table });
    if (district) q.append("district", district);

    const res = await fetch(`${API}/export?format=pdf&${q.toString()}`);
    const blob = await res.json();
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url

    const doc = new jsPDF("landscape", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logoImg = new Image();
    const fullRows = blob.rows || [];
    const fullCharts = blob.charts || {};
    // logo.src = "/logo.jpg";
    logoImg.src = logo;   // <-- use imported image

    await new Promise(resolve => {
      logoImg.onload = resolve;
    });
    // console.log(logoImg);
    doc.addImage(logoImg, "JPEG", 40, 20, 50, 50);


    /* ===== HEADER ===== */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text("Remote Sensing Applications Centre, Uttar Pradesh", 100, 35);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text("Lucknow, Uttar Pradesh", 100, 55);

    doc.setFontSize(14);


    doc.text(`Sarus Census Report for ${table.charAt(0).toUpperCase() + table.slice(1).replace('_', ' ').replace(/_/g, '/')}`, pageWidth / 2, 85, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(0);




    /* ===== CHART ===== */

    if (!isLucknow) {
      const canvas = document.querySelector(".chart-pane canvas");
      if (!canvas) {
        console.log("Chart not found in DOM");
      }
      if (canvas) {
        const img = canvas.toDataURL("image/png");
        doc.addImage(img, "PNG", 50, 130, pageWidth - 100, 420);
      }
    }

    if (isLucknow) {
      const canvases = document.querySelectorAll(".chart-pane canvas");
      if (canvases.length >= 2) {
        const leftImg = canvases[0].toDataURL("image/png");
        const rightImg = canvases[1].toDataURL("image/png");

        const chartWidth = (pageWidth - 100) / 2;
        const chartHeight = 200;

        doc.addImage(leftImg, "PNG", 20, 170, chartWidth - 70, chartHeight + 20);
        doc.addImage(rightImg, "PNG", 70 + chartWidth, 170, chartWidth -50, chartHeight + 30);
      }
    }

    /* ===== TABLE ===== */

    doc.addPage();

    const headers = Object.keys(fullRows[0] || {}).filter(h => h !== "gid" && h !== "site");

    autoTable(doc, {
    head: [headers.map(h => h.replace(/_/g, " ").toUpperCase())],

body: fullRows.map(row =>
  headers.map(h => row[h] ?? "")
),

      startY: 60,
      theme: "grid",
      styles: { fontSize: 8, halign: "center" },
      headStyles: { fillColor: [0, 76, 153], textColor: 255 }
    });

    const date = new Date().toLocaleDateString("en-GB");

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Generated by RSAC UP • ${date}`,
      pageWidth / 2,
      pageHeight - 20,
      { align: "center" }
    );

    doc.save(`${table}_report.pdf`);
  };

  /* ================= UI ================= */

  return (
    <>
      <Header />

      <div className="controls">

        <select
          value={district}
          onChange={e => {
            setPage(1);
            setDistrict(e.target.value);
          }}
        >
          <option value="">All Districts</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {!isLucknow && (
          <select
            value={perPage}
            onChange={e => {
              setPage(1);
              setPerPage(+e.target.value);
            }}
          >
            {[10, 25, 50].map(n => (
              <option key={n} value={n}>{n} Rows</option>
            ))}
          </select>
        )}

        <button className="btn btn-danger btn-sm" onClick={handlePdfExport}>
          PDF
        </button>
        <button
          className="btn btn-success btn-sm"
          onClick={async () => {

            let chartImage = null;
            let habitatChartImage = null;
            let compositionChartImage = null;

            const canvases = document.querySelectorAll(".chart-pane canvas");

            if (isLucknow && canvases.length >= 2) {
              compositionChartImage = canvases[0].toDataURL("image/png"); // Adults/Juvenile/Nests
              habitatChartImage = canvases[1].toDataURL("image/png");     // Habitat pie
            }
            else if (!isLucknow && canvases.length >= 1) {
              chartImage = canvases[0].toDataURL("image/png"); // Bar chart
            }


            const res = await fetch(`${API}/export`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                format: "excel",
                table,
                district,
                chartImage,
                habitatChartImage,
                compositionChartImage
              })
            });

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "RSAC_Sarus_Report.xlsx";
            a.click();
          }}
        >
          Excel
        </button>

        <a
          className="btn btn-secondary btn-sm"
          href={`${API}/export?table=${table}&format=csv${district ? `&district=${district}` : ""}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          CSV
        </a>

      </div>

      <div className="total">
        Total Sarus Count: {total}
      </div>

      <div className="layout">

        <div className="chart-pane" style={{
          maxHeight: "800px",
          overflowY: "auto",
          paddingRight: "5px"
        }}>
          {isLucknow ? (
            <>
              <div style={{ maxHeight: '950px', overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
                <SarusPieChart
                  title="Adults / Juveniles / Nests"
                  charts={charts.population}
                />
                <SarusPieChart
                  title="Sarus Count by Habitat"
                  charts={charts.habitat}
                  type="habitat"
                />
              </div>
            </>

          ) : (
            charts.district &&
            charts.district.length > 0 && (
              <SarusBarChart
                charts={charts.district}
                mode={district ? "habitat" : "district"}
              />
            )
          )




          }
        </div>

        <div className="table-pane">
          <SarusTable rows={rows} page={page} perPage={perPage} isLucknow={isLucknow} />
          {!isLucknow && rows.length > 0 && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          )}
        </div>

      </div>
    </>
  );
}
