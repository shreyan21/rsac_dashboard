export async function fetchDistricts(table) {
  const r = await fetch(`http://localhost:5000/api/sarus/districts?table=${table}`);
  return r.json();
}

export async function fetchSarusData(table, district, page, perPage) {

  let url = `http://localhost/api/sarus/report?table=${table}&page=${page}&per_page=${perPage}`;

  if (district) {
    url += `&district=${district}`;
  }

  const r = await fetch(url);
  return r.json();

}

export function exportSarus(table, format, district) {

  let url = `http://localhost:5000/api/sarus/export?table=${table}&format=${format}`;

  if (district) {
    url += `&district=${district}`;
  }

  window.open(url);

}
