import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Grafica = ({ data }) => {
  const options = {
    title: {
      display: true,
      text: "Error vs Iteracion",
    },
  };

  return (
    <>
      <Line options={options} data={data} />
    </>
  );
};

export default Grafica;
