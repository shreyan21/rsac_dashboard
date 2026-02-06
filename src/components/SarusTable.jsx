export default function SarusTable({ rows, page, perPage, isLucknow }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>SNo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "20px", textAlign: "center" }}>
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>SNo</th>
            {!isLucknow && <th>District</th>}
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Habitat</th>
            <th>Sarus Count</th>
            <th>Site</th>
            <th>Adults</th>
            <th>Juvenile</th>
            <th>Nests</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{(i + 1) + ((page - 1) * perPage)}</td>

              {!isLucknow && <td>{r.district}</td>}
              <td>{r.latitude}</td>
              <td>{r.longitude}</td>
              <td>{r.habitat}</td>
              <td>{r.sarus_count}</td>
              <td>{r.site}</td>
              <td>{r.adult ?? r.adults ?? 0}</td>
              <td>{r.juvenile ?? 0}</td>
              <td>{r.nests ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
