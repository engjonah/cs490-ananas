import React, { useState } from 'react';
//import './DocumentationPage.css'; // Import CSS for styling

function FAQ() {
  // Sample FAQ data
  const faqData = [
    { question: 'How do I use this service?', answer: 'Please download the user guide below.' },
    { question: 'How does the translation work?', answer: 'Our translation is powered by the OpenAI GPT LLM.' },
    { question: 'How much does this cost to use?', answer: 'As of right now, this service is completely free!' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter FAQ items based on search term
  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="faq">
      <input
        type="text"
        placeholder="Search FAQ"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredFAQ.map((item, index) => (
          <li key={index}>
            <strong>{item.question}</strong>
            <p>{item.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FAQ;
