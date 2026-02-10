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

const API = "http://localhost:5000";

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

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!table) return;
    fetch(`${API}/districts?table=${table}`)
      .then(r => r.json())
      .then(setDistricts);
  }, [table]);

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
    .then(r => r.json())
    .then(d => {
      setRows(d.rows || []);
      setTotalRows(d.totalRows || 0);
      setTotal(d.total || 0);
      setCharts(d.charts || {});
    });

}, [table, page, perPage, district]);


const totalPages = isLucknow ? 1 : Math.ceil(totalRows / perPage);

  /* ================= PDF EXPORT ================= */

  const handlePdfExport = async () => {

    const q = new URLSearchParams({ table });
    if (district) q.append("district", district);

    const res = await fetch(`${API}/report?${q}`);
    const fullData = await res.json();
    const fullRows = fullData.rows || [];
    const chartData = district ? fullData.charts.site : fullData.charts.district;

    const doc = new jsPDF("landscape", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
let chartStartY=130;
    /* ================= HEADER ================= */

    const logoImg = new Image();
    logoImg.src = "http://localhost:5000/logo.jpg";
    await new Promise(resolve => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve;
    });

    if (logoImg.complete) {
      doc.addImage(logoImg, "JPEG", 40, 20, 50, 50);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text("Remote Sensing Applications Centre, Uttar Pradesh", 100, 35);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text("Lucknow, Uttar Pradesh", 100, 55);

    doc.setFontSize(14);
    doc.text("Sarus Census Report", pageWidth / 2, 85, { align: "center" });

    doc.setFontSize(14);
    doc.text(`TOTAL SARUS COUNT : ${total}`, pageWidth / 2, 105, { align: "center" });


/* ================= CLEAN HORIZONTAL BAR CHART (FROM FRONTEND) ================= */

if (!isLucknow) {

  const canvas = document.querySelector(".chart-pane canvas");

  if (canvas) {

    const img = canvas.toDataURL("image/png", 1.0);

    const imgWidth = pageWidth - 100;
    const imgHeight = 420;

    doc.addImage(
      img,
      "PNG",
      50,
      130,
      imgWidth,
      imgHeight
    );
  }

}


    /* ================= LUCKNOW PIE PAGE ================= */

    if (isLucknow) {

      doc.addPage();

      const canvases = document.querySelectorAll(".chart-pane canvas");

      if (canvases.length >= 2) {

        const leftImg = canvases[0].toDataURL("image/png");
        const rightImg = canvases[1].toDataURL("image/png");

        const chartWidth = (pageWidth - 140) / 2;
        const chartHeight = pageHeight - 200;

        doc.setFontSize(14);
        doc.setTextColor(0, 51, 102);
        doc.text("Lucknow Population Overview", pageWidth / 2, 60, { align: "center" });

        doc.addImage(leftImg, "PNG", 60, 90, chartWidth, chartHeight);
        doc.addImage(rightImg, "PNG", 80 + chartWidth, 90, chartWidth, chartHeight);
      }
    }

    /* ================= TABLE ================= */

if (chartStartY > pageHeight - 200) {
  doc.addPage();
  chartStartY = 60;
}

    const headers = Object.keys(fullRows[0] || {}).filter(h => h !== "gid");

    const formattedHeaders = headers.map(h => {
      const key = h.toLowerCase();
      if (key === "range_fore") return "RANGE FOREST";
      if (key === "name_of_co") return "NAME OF COLONY";
      if (key === "sarus_count") return "SARUS COUNT";
      return h.replace(/_/g, " ").toUpperCase();
    });
    doc.addPage()

    autoTable(doc, {
      head: [["SNo", ...formattedHeaders]],
      body: fullRows.map((row, idx) => [
        idx + 1,
        ...headers.map(h => row[h] ?? "")
      ]),
      startY: 60,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 4,
        halign: "center"
      },
      headStyles: {
        fillColor: [0, 76, 153],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 248, 252]
      }
    });

    /* ================= FINAL FOOTER ================= */

    const indianDate = new Date().toLocaleDateString("en-GB");
    const finalPage = doc.getNumberOfPages();
    doc.setPage(finalPage);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Generated by RSAC UP • ${indianDate}`,
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
        <select value={district} onChange={e => { setPage(1); setDistrict(e.target.value); }}>
          <option value="">All Districts</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={perPage} onChange={e => { setPage(1); setPerPage(+e.target.value); }}>
          {[10, 25, 50].map(n => <option key={n} value={n}>{n} Rows</option>)}
        </select>

        <button className="btn btn-danger btn-sm" onClick={handlePdfExport}>PDF</button>

        <a
          className="btn btn-success btn-sm"
          href={`${API}/export?table=${table}&format=excel${district ? `&district=${district}` : ""}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Excel
        </a>

        <a
          className="btn btn-secondary btn-sm"
          href={`${API}/export?table=${table}&format=csv${district ? `&district=${district}` : ""}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          CSV
        </a>
      </div>

      <div className="total">Total Sarus Count: {total}</div>

      <div className="layout">
        <div className="chart-pane">
          {isLucknow ? (
            <>
              <SarusPieChart title="Adults / Juveniles / Nests" charts={charts.population} />
              <SarusPieChart title="Sarus Count by Habitat" charts={charts.habitat} type="habitat" />
            </>
          ) : (
            <SarusBarChart
              charts={district ? charts.site : charts.district}
              mode={district ? "site" : "district"}
            />
          )}
        </div>

        <div className="table-pane">
          <SarusTable rows={rows} page={page} perPage={perPage} isLucknow={isLucknow} />
          {rows.length > 0 && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          )}
        </div>
      </div>
    </>
  );
}
