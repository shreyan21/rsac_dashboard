export default function SarusTable({ rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>SNo</th>
            <th>District</th>
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
              <td>{r.sno}</td>
              <td>{r.district}</td>
              <td>{r.latitude}</td>
              <td>{r.longitude}</td>
              <td>{r.habitat}</td>
              <td>{r.sarus_count}</td>
              <td>{r.site}</td>
              <td>{r.adult}</td>
              <td>{r.juvenile}</td>
              <td>{r.nests}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
