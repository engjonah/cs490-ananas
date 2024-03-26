import React from 'react';
import './DocumentationPage.css'; // Import CSS for styling
import userguide from "../assets/AnanasUserGuide.pdf";
import FAQ from "../components/FAQ";

function DocumentationPage() {
  return (
    <div className="documentation-container">
      <div className="header">
        <div className="background-gif" />
        <h1 className="title">Documentation</h1>
      </div>
      <div className="content">
        <h2>MERN</h2>
        <p>
          This website was created with the MERN Stack:
        </p>
        <ul>
          <li><strong>MongoDB:</strong> A NoSQL database used for storing application data.</li>
          <li><strong>Express.js:</strong> A web application framework for Node.js used for building server-side applications.</li>
          <li><strong>React.js:</strong> A JavaScript library for building user interfaces.</li>
          <li><strong>Node.js:</strong> A JavaScript runtime environment that executes JavaScript code server-side.</li>
        </ul>
        
        <h2>Translation</h2>
        <p>
          Code Translation is done through OpenAI API utilizing the <b>GPT 3.5 turbo model</b>. 
        </p>
        
        <h2>Authentication</h2>
        <p>
          Authentication is handled through <b>Firebase API</b>. 
        </p>
        
        <h2>Data Collection</h2>
        <p>
          Information we keep:
        </p>
        <ul>
          <li><strong>User Details:</strong> We keep emails and usernames. Passwords are handled through Firebase</li>
          <li><strong>Translation History:</strong> We keep the translation history for to make improvements in the future</li>
        </ul>
      </div>

      {/* Help Section */}
      <div className="help-container">
        <h2>Help</h2>
        <div className="faq">
          <FAQ/>
        </div>
        <div className="user-guide">
        <h3>User Guide</h3>
          <p>Download our user guide for instructions on how to use this site!</p>
          <a href={userguide} target="_blank" rel="noopener noreferrer">Download User Guide </a>
        </div>
      </div>
    </div>
  );
}

export default DocumentationPage;
