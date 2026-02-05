import { useEffect, useState } from "react";
import Header from "../components/Header";
import TransportAnalyticsCards from "../components/TransportAnalyticsCards";
import TransportSummaryCards from "../components/TransportSummaryCards";

export default function TransportDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/transport/dashboard")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  return (
    <>
      <Header />
      <TransportAnalyticsCards data={data.analytics} />
      <TransportSummaryCards data={data.summary} />
    </>
  );
}
