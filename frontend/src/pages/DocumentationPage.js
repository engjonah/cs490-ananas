import React, {useEffect} from 'react';
import './DocumentationPage.css'; // Import CSS for styling
import userguide from "../assets/AnanasUserGuide.pdf";
import FAQ from "../components/FAQ";
import { Typography, Grid, Container, Card } from '@mui/material';

function DocumentationPage() {

  useEffect(() => {
    // JavaScript
    function initializeVideo() {
      // Get reference to the video container and thumbnail
      const videoContainer = document.querySelector(".video-container");
      const thumbnail = videoContainer.querySelector(".video-frame");

      // Add click event listener to the thumbnail
      thumbnail.addEventListener("click", function() {
          // Replace the thumbnail with the iframe
          videoContainer.innerHTML = `
              <iframe class="video-frame" title="Ananas Final Walkthrough" 
              src="https://www.youtube.com/embed/JVIpPHcqXLY?si=_a8G9yAh9Pe4-qQ5" 
              frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
              </iframe>
          `;

      });
    }

    // Call the function to initialize video functionality
    initializeVideo();
  }, []);
  return (
    <Grid>
      <Grid className="header">
        <div className="background-gif" />
        <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 4, sm: 4 },
        }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
              mt: '20%',
              fontWeight:'bold'
            }}
          >
            Documentation
          </Typography>
        </Container>
      </Grid>
      {/* Help Section */}
      <Card variant='outlined' className="help-container">
        <Typography variant='h4'>User Guide</Typography>
        <Card  sx={{
          backgroundColor: '#f9f9f9',
          mt: '1vh',
          padding: '2vh',
          boxShadow:'0px 5px 15px rgba(0, 0, 0, 0.1)',
          mb:'2vh'
          }}>
          <p><a  href={userguide} target="_blank" rel="noopener noreferrer">Download our user guide</a> or watch the walkthrough below for instructions on how to use this site!</p>
            <Card class="video-container">
              <img className="video-frame" src="https://awlights.com/wp-content/uploads/sites/31/2017/05/video-placeholder.png" alt="Video Thumbnail" />
            </Card>
          </Card>
        <FAQ/>
        </Card>
      <Card variant='outlined' className='content'>
      <Typography variant='h4'>Developer Guide</Typography>
        <h3>MERN</h3>
        <p>
          This web application was created with the MERN Stack:
        </p>
        <ul>
          <li><strong>MongoDB:</strong> A NoSQL database used for storing application data.</li>
          <li><strong>Express.js:</strong> A web application framework for Node.js used for building server-side applications.</li>
          <li><strong>React.js:</strong> A JavaScript library for building user interfaces.</li>
          <li><strong>Node.js:</strong> A JavaScript runtime environment that executes JavaScript code server-side.</li>
        </ul>
        
        <h3>Translation</h3>
        <p>
          Code Translation is done through OpenAI API utilizing the <a href="https://platform.openai.com/docs/models/gpt-3-5-turbo"><b>GPT-3.5 Turbo Model</b></a>. 
        </p>
        
        <h3>Authentication</h3>
        <p>
          Authentication is handled through <b>Firebase API</b>. This includes user login and account creation as well as Two Factor Authentication.
        </p>
      </Card>
      <Card variant='outlined' className='content' sx={{mb:'5vh'}}>
          <Typography variant='h4'>Disclosures</Typography>
          <p>
            Information we collect:
          </p>
          <ul>
            <li><strong>User Details:</strong> We store emails and usernames. Passwords are handled through Firebase</li>
            <li><strong>Translation History:</strong> We store the translation history to make improvements to our translation tool. Users are able to view and delete past translations in the translation history section. </li>
          </ul>
      </Card>
    </Grid>
  );
}

export default DocumentationPage;
