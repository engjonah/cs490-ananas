import React from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Button, Grid } from '@mui/material';
import './HomePage.css'; // Import the CSS file for HomePage



const HomePage = () => {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    scrollable: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  const labels = ['1', '2', '3', '4', '5'];

  const data = {
    labels,
    datasets: [
      {
        label: 'User Ratings',
        data: [26,20,44,23,55],
        backgroundColor: 'pink',
      },

    ],
  };

  return (
    <div className="HomePage">
      <Grid container spacing={2} justifyContent="center" alignItems="center" className="HomePage-content">
        <Grid item xs={12} sm={6}>
          <h2>How to Use</h2>
          <ol>
            <li>Select Source Language</li>
            <li>Select Destination Item</li>
            <li>Select Convert</li>
            <li>That's It!</li>
          </ol>
          <h2>Overview</h2>
          <p>Tool to quickly and accurately convert code from one language to another utilizing ChatGPT 3.5</p>
        </Grid>
      </Grid>
      
      <Grid container justifyContent="center" className="HomePage-button">
        <Grid item>
          <Link to="/translate">
            <Button variant="contained" style={{ backgroundColor: '#CACACA', color: 'black', font:'Fira Code'}}>Translate Now!</Button>
          </Link>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center" alignItems="center" className="HomePage-content">
        <Grid item xs={12} sm={6}>
          <h2>Reviews</h2>
          <p>See what real users have to say about our service!</p>
          {/* <Bar
            options={options}
            data={data}/> */}
        </Grid>
      </Grid>

      <Grid container justifyContent="center" className="HomePage-feedback-bar-chart">
        <Grid item>
            <Bar
            options={options}
            data={data}/>
        </Grid>
      </Grid>
    </div>
  );
}

export default HomePage;
