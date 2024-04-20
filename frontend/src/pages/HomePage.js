import React,  { useState, useEffect } from 'react';
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
import './HomePage.css'; // Import the CSS file for HomePage
import { ErrorReport } from '../services/ErrorReport';
import FeedbackDisplay from '../components/FeedbackDisplay';




const HomePage = () => {
  const [ratingCounts, setRatingCounts] = useState([0,0,0,0,0]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);



  useEffect(() => {
    fetch(`${ApiUrl}/api/feedbackDisplay/metrics`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error retrieving feedback');
        }
        return response.json();
      })
      .then(data => {
        setRatingCounts(data.RatingCounts);
        setAverageRating(data.AverageRating);
      })
      .catch(error => {
        ErrorReport("Account Details:" + error.message);
        setError(error.message);
        console.log(error);
      });
  }, []); 

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


  console.log("rating counts: " + ratingCounts)

  const labels = ['1', '2', '3', '4', '5'];
  
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

        { averageRating > 0 &&
        <>
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
        <Grid container spacing={2} justifyContent="center" alignItems="center" className="HomePage-content">
          <Grid item xs={12} sm={6}>
            {averageRating > 0 && <h3>Average Rating: {averageRating} / 5</h3>}
          
          </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent="center" alignItems="center" className="HomePage-content">
          <Grid item xs={12} sm={6}>
            <FeedbackDisplay/>
          </Grid>
        </Grid>
        </>}

      
    </div>
  );
}

export default HomePage;
