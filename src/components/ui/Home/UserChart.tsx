import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', women: 5, men: 5 },
  { name: 'Feb', women: 4, men: 4 },
  { name: 'Mar', women: 8, men: 8 },
  { name: 'Apr', total: 25, women: 15, men: 10 },
  { name: 'May', total: 25, women: 10, men: 15 },
  { name: 'Jun', total: 10, women: 3, men: 7 },
  { name: 'Jul', total: 18, women: 10, men: 8 },
  { name: 'Aug', total: 27, women: 15, men: 12 },
  { name: 'Sep', total: 32, women: 18, men: 14 },
  { name: 'Oct', total: 20, women: 10, men: 10 },
  { name: 'Nov', total: 10, women: 4, men: 6 },
  { name: 'Dec', total: 5, women: 2, men: 3 },
];

const UserBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="men" fill="#D8BFD8" />    
        <Bar dataKey="women" fill="#FFC0CB" />  
       
    </BarChart>
    </ResponsiveContainer> 
  );
};

export default UserBarChart;