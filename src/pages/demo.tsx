import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 1, value: 2 },
  { name: 2, value: 5.5 },
  { name: 3, value: 2 },
  { name: 5, value: 8.5 },
  { name: 8, value: 1.5 },
  { name: 10, value: 5 },
];

const MyChart = () => (
  <div>
    <h2>My Line Chart</h2>
    <LineChart width={1500} height={1300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  </div>
);

export default MyChart;
