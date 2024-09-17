import ButtonPrimary from "shared/Button/ButtonPrimary";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
// import NcImage from "shared/NcImage/NcImage";
import CardDashboard from "components/CardDashboard";
import { getAllDashboard } from "services/player/dashboard";
import Guide from "components/Guide/Guide";

// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.register(ArcElement, Tooltip, Legend);


const PagePlayerDashboard: React.FC = () => {
  const [data, setData]: any = useState({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const chart_data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Statistics',
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const line_data = {
    labels,
    datasets: [
      {
        label: 'Classes',
        data: labels.map(() => Math.random() * 100),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Students',
        data: labels.map(() => Math.random() * 100),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDashboard(); // coach id
        setData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  return (
    <div className="nc-Page404">
      <Helmet>
        <title>Dashboard || Tennisbrain: Coach</title>
      </Helmet>
      <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
      <Guide />
        {/* HEADER */}
        <header className="text-left max-w-2xl space-y-2 mb-5 pt-4">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        </header>
        <div className="mt-1">
          <div className="flex flex-row flex-nowrap gap-x-2 mb-5">
            <CardDashboard name="COMPLETED" desc={data?.completed_sessions?.length || '0'} size="large" />
            <CardDashboard name="UPCOMING" desc={data?.upcoming_sessions?.length || '0'} size="large" />
            <CardDashboard name="PLAYERS" desc={"3"} size="large" />
            {/* <CardDashboard name="COACHES" desc={"5"} size="large" /> */}
          </div>
          <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                <div className="bg-blue-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-700">Player Statistics</h2>
                  <p className="mt-1">Overview of player performance and stats.</p>
                </div>

                <div className="bg-green-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-700">Upcoming Matches</h2>
                  <p className="mt-1">Manage and view future scheduled matches.</p>
                </div>

                <div className="bg-red-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-700">Training Schedule</h2>
                  <p className="mt-1">Plan and track training sessions.</p>
                </div>

                <div className="bg-yellow-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-700">Messages</h2>
                  <p className="mt-1">Communicate with players and staff.</p>
                </div>

                <div className="bg-purple-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-700">Drill Library</h2>
                  <p className="mt-1">Access and organize practice drills.</p>
                </div>

                <div className="bg-pink-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-700">Personal Notes</h2>
                  <p className="mt-1">Keep notes on players and strategies.</p>
                </div>

              </div>
            </div>
            <div className="flex flex-row flex-nowrap gap-x-2 bg-gray-200 p-5">
              {/* <Pie data={chart_data} /> */}
              <Line options={options} data={line_data} />
            </div>
          </div>
          <div className="pt-8">
            <ButtonPrimary href="/">Return Home Page</ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagePlayerDashboard;
