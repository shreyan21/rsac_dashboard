export async function fetchTransportDashboard() {

  const r = await fetch("http://localhost:5000/api/transport/dashboard");
  return r.json();

}

export function exportTransportPDF() {
  window.open("http://localhost:5000/api/transport/export?format=pdf");
}
