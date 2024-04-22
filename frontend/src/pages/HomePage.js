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
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import TerminalIcon from '@mui/icons-material/Terminal';

const steps = [
  
  {
    icon: <TerminalIcon />,
    title: 'Code + Language',
    description:
      'Provide the starting code + select the input and output language',
  },
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: 'Convert ',
    description:
      'Simply hit translate to get your result',
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: 'Feedback',
    description:
      'Provide feedback on the accuracy of the conversion',
  },
];
function Overview() {
  return (
    <Box
      id="Overview"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: '#292d2e',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h2" sx={{fontWeight:'bold'}}>
            Overview
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Quick guide on how to translate your code
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {steps.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack
                direction="column"
                color="inherit"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  p: 3,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'grey.800',
                  background: 'transparent',
                  backgroundColor: 'grey.900',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography fontWeight="medium" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
function Intro() {
  return (
    <Box
      id="Intro"
      sx={{
        width: '100%',
        backgroundImage:
          'linear-gradient(180deg, #c9c7c7, #FFF)',
        backgroundSize: '100% 80%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '80%' } }}>
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
              fontWeight: 'bold'
            }}
          >
            Seamless Code Translations
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            Explore our cutting-edge translation capabilities. Quickly and accurately convert your code from one language to another.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
          
          <Link to="/translate">
            <Button variant="contained" style={{ backgroundColor: '#CACACA', color: 'black'}}>Translate Now</Button>
          </Link>
          </Stack>
          <Typography variant="caption" textAlign="center" sx={{ opacity: 0.8 }}>
            Powered by ChatGPT 3.5
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}



const HomePage = () => {
  const [ratingCounts, setRatingCounts] = useState([0,0,0,0,0]);
  const [averageRating, setAverageRating] = useState(0);



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
    devicePixelRatio: 5,
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
        data: ratingCounts,
        backgroundColor: 'pink',
      },

    ],
  };

  return (
    <div className="HomePage">
      <Intro/>
      <Overview/>
      { averageRating > 0 && 
        <Container sx={{ py: { xs: 8, sm: 16 } }}>
          <Grid container spacing={6}>
            <Box
            sx={{
              width: { sm: '100%', md: '100%' },
              textAlign: { sm: 'left', md: 'center' },
            }}
          >
              <Typography component="h2" variant="h2" sx={{fontWeight:'bold'}}>
                Reviews
              </Typography>
              <Typography
              textAlign="center"
              color="text.secondary"
              sx={{ alignSelf: 'center', width: { sm: '100%', md: '100%' } }}
              >
                See what people have to say about our service
              </Typography>
            </Box>
            </Grid>
            <Grid container spacing={4} justifyContent={"center"} marginTop='2vh'>
              <Grid item xs = {6}>    
                  <FeedbackDisplay/>
              </Grid>
              <Grid item xs = {6}>
                <Box
                  component={Card}
                  variant="outlined"
                  
                  sx={{
                    height: { xs: 200, sm: 500 },
                    width: '100%',
                    backgroundSize: 'cover',
                    borderRadius: '10px',
                    outline: '1px solid',
                    outlineColor:alpha('#c9c7c7', 0.5),
                    boxShadow:
                      `0 0 12px 8px ${alpha('#c9c7c7', .2)}`
                      
                  }}
                >
                  <Grid sx={{margin:'2vw' }} >
                    <Bar 
                          options={options}
                          data={data}/>
                  </Grid>
                  <Grid justifyItems={'center'} >
                    <Grid item xs={10} sm={12}>
                    {averageRating > 0 && 
                      <Grid alignItems={'center'} sx={{textAlign: { sm: 'left', md: 'center' }}}>
                          <Typography variant='h4' fontWeight='medium'>Average Rating: {averageRating} / 5</Typography>

                      </Grid>
                    }
                    </Grid>
                  </Grid>

                </Box>
              </Grid>
          </Grid>
          
        </Container>
        
        }

      
    </div>
  );
}

export default HomePage;
