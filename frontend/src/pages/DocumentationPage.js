import React from 'react';
import './DocumentationPage.css'; // Import CSS for styling

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
        <p>
        </p>
        <h2>Translation</h2>
        <p>
          Code Translation is done through OpenAI API utilizing the <b>GPT 3.5 turbo model</b>. 
        </p>
        <h2>Authentication</h2>
        <p>
          Authentication is handled through <b> Firebase API </b>. 
        </p>
        <h2>Data Collection</h2>
        <p>
          Information we keep:
        </p>
        <ul>
          <li><strong>User Details:</strong> A NoSQL database used for storing application data.</li>
          <li><strong>Translation History.js:</strong> A web application framework for Node.js used for building server-side applications.</li>
          <li><strong></strong> A JavaScript library for building user interfaces.</li>
          <li><strong>Node.js:</strong> A JavaScript runtime environment that executes JavaScript code server-side.</li>
        </ul>
      </div>
    </div>
  );
}

export default DocumentationPage;
