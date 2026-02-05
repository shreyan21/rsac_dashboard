import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import SarusBarChart from "../components/SarusBarChart";
import SarusPieChart from "../components/SarusPieChart";
import SarusTable from "../components/SarusTable";
import Pagination from "../components/Pagination";

const API = "http://localhost:5000";

export default function SarusReport() {
  const [params] = useSearchParams();
  const table = params.get("table");

  const [rows, setRows] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [charts, setCharts] = useState({});
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [district, setDistrict] = useState("");

  const isLucknow = table === "sarus_lucknow_population";

  /* districts */
  useEffect(() => {
    if (!table) return;
    fetch(`${API}/districts?table=${table}`)
      .then(r => r.json())
      .then(setDistricts);
  }, [table]);

  /* report */
  useEffect(() => {
    if (!table) return;

    const q = new URLSearchParams({
      table,
      page,
      per_page: perPage
    });

    if (district) q.append("district", district);

    fetch(`${API}/report?${q}`)
      .then(r => r.json())
      .then(d => {
        setRows(d.rows || []);
        setTotal(d.total || 0);
        setCharts(d.charts || {});
      });
  }, [table, page, perPage, district]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

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

        <a className="btn pdf" href={`${API}/report/export/pdf?table=${table}`}>PDF</a>
        <a className="btn excel" href={`${API}/report/export/excel?table=${table}`}>Excel</a>
        <a className="btn csv" href={`${API}/report/export/csv?table=${table}`}>CSV</a>
      </div>

      <div className="total">Total Sarus Count: {total}</div>

      <div className="layout">
        <div className="chart-pane">
        {isLucknow ? (
  <>
    <SarusPieChart
      title="Adults / Juveniles / Nests"
      charts={charts.population}
    />
    <SarusPieChart
      title="Sarus Count by Habitat"
      charts={charts.habitat}
      type="habitat"
    />
  </>
) : (
  <SarusBarChart charts={charts.district || charts.districts} />
)}

        </div>

        <div className="table-pane">
          <SarusTable rows={rows} />
          {totalPages > 1 && (
  <Pagination
    page={page}
    totalPages={totalPages}
    onChange={setPage}
  />
)}

        </div>
      </div>
    </>
  );
}
