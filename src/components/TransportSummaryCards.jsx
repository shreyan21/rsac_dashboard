import { Bar } from "react-chartjs-2";

export default function TransportAnalyticsCards({ analytics }) {

  if (!analytics) return null;

  const cards = [
    {
      title: "Total length of National Highways in km",
      data: analytics.nh
    },
    {
      title: "Total length of State Highways in km",
      data: analytics.sh
    },
    {
      title: "Total length of other roads in km",
      data: analytics.or
    },
    {
      title: "Total length of Railway Networks in km",
      data: analytics.rail
    }
  ];

  return (

    <div className="transport-analytics-row">

      {cards.map((card, idx) => (

        <div key={idx} className="analytics-card">

          <h4>{card.title}</h4>

          <div className="analytics-values">

            <div>
              <b>2010 yr :</b> {Number(card.data.y2010).toLocaleString()}
            </div>

            <div>
              <b>2018 yr :</b> {Number(card.data.y2018).toLocaleString()}
            </div>

          </div>

          <div className="analytics-chart">

            <Bar
              data={{
                labels: ["2010", "2018"],
                datasets: [
                  {
                    data: [
                      card.data.y2010,
                      card.data.y2018
                    ]
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  x: { display: false },
                  y: { display: false }
                }
              }}
            />

          </div>

        </div>

      ))}

    </div>

  );
}
