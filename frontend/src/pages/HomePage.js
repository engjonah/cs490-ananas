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
import ApiUrl from '../ApiUrl';
import { Button, Grid } from '@mui/material';
import { useAuthContext } from '../hooks/useAuthContext';
import './HomePage.css'; // Import the CSS file for HomePage



const HomePage = () => {
  var ratingCounts, averageRating;
  const { user } = useAuthContext();

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
  fetch(`${ApiUrl}/api/feedback/metrics`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${user.token}`,
    },
  }).then(response=> response.json())
  .then( data => {
    ratingCounts = data.RatingCounts;
    console.log(ratingCounts)
    console.log([1,2,3,4,10])
    averageRating = data.AverageRating;
  })
  const data = {
    labels,
    datasets: [
      {
        label: 'User Ratings',
        data: ratingCounts,
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
         
        </Grid>
      </Grid>

      <Grid container justifyContent="center" className="HomePage-feedback-bar-chart">
        <Grid item xs={6} sm={3} >
            <Bar
            options={options}
            data={data}/>
        </Grid>
      </Grid>
    </div>
  );
}

export default HomePage;
