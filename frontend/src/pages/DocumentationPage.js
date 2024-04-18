import React, {useEffect} from 'react';
import './DocumentationPage.css'; // Import CSS for styling
import userguide from "../assets/AnanasUserGuide.pdf";
import FAQ from "../components/FAQ";

function DocumentationPage() {

  useEffect(() => {
    // JavaScript
    function initializeVideo() {
      // Get reference to the video container and thumbnail
      const videoContainer = document.querySelector(".video-container");
      const thumbnail = videoContainer.querySelector(".video-thumbnail");

      // Add click event listener to the thumbnail
      thumbnail.addEventListener("click", function() {
          // Replace the thumbnail with the iframe
          videoContainer.innerHTML = `
              <iframe class="video-frame" title="Ananas Walkthrough" 
              src="https://www.youtube.com/embed/K17iPxd6xAg?autoplay=1" 
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
    <div className="documentation-container">
      <div className="header">
        <div className="background-gif" />
        <h1 className="title">Documentation</h1>
      </div>
      {/* Help Section */}
      <div className="help-container">
        <h2>User Guide</h2>
        <p><a  href={userguide} target="_blank" rel="noopener noreferrer">Download our user guide</a> or watch the walkthrough below for instructions on how to use this site!</p>
        <div class="video-container">
        <img className="video-thumbnail" src="https://i.ytimg.com/vi/K17iPxd6xAg/hqdefault.jpg" alt="Video Thumbnail" />
        </div>
        <FAQ/>
      </div>
      <div className="content">
        <h2>Developer Guide</h2>
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
          Authentication is handled through <b>Firebase API</b>. 
        </p>
      </div>
      <div class="content">
        <h2>Disclosures</h2>
          <p>
            Information we collect:
          </p>
          <ul>
            <li><strong>User Details:</strong> We store emails and usernames. Passwords are handled through Firebase</li>
            <li><strong>Translation History:</strong> We store the translation history to make improvements to our translation tool</li>
          </ul>
      </div>
    </div>
  );
}

export default DocumentationPage;
