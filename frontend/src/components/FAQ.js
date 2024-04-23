import React, { useState } from 'react';
import DOMPurify from 'dompurify'
import { TextField } from '@mui/material'

//import './DocumentationPage.css'; // Import CSS for styling

function FAQ() {
  // FAQ data
  const faqData = [
    { question: 'How do I use Ananas?', answer: 'See the user guide and app walkthrough above!' },
    { question: 'What languages does we support?', answer: '<ul><li>Python</li><li>Java</li><li>C++</li><li>Ruby</li><li>C#</li><li>JavaScript</li><li>Kotlin</li><li>Objective-C</li></ul>'},
    { question: 'How we translate code?', answer: 'Our translation feature is powered by the OpenAI\'s <a href="https://platform.openai.com/docs/models/gpt-3-5-turbo">GPT-3.5 Turbo model</a>, capable of understanding as well as generating natural language and code. We do this by calling the <a href="https://platform.openai.com/docs/api-reference/chat/create">Chat Completions API</a> with engineered prompts.' },
    { question: 'How much does Ananas cost to use?', answer: 'As of right now, Ananas is completely free!' },
    { question: 'Why is my translation failing?', answer: 'If you try to place too many requests, you can run into the rate limit. Otherwise, there may be an issue connecting to OpenAI\'s API or another unknown error. In either case, try waiting and retranslating the code.' },
    { question: 'How accurate are the translations?', answer: 'Our application employs sophisticated prompts to ensure translations correctly choose appropriate packages/libraries and methods/functions without adding any unnecessary output. In order to collect more data about the accuracy of our translations, please provide feedback by clicking the "Feedback" button on the translate page. In the future, we plan on utilizing OpenAI\'s new <a href="https://openai.com/blog/introducing-gpts">custom GPTs</a> functionality, which enables models to combine instructions, extra knowledge, and any combination of skills. You can also see what other users have to say about our application in the \'Reviews\' section on our homepage.' },
    { question: 'Are there any limitations to how much code I can convert?', answer: 'Ananas currently supports a maximum of 100 lines of code in order to optimize performance, ensure translation accuracy, and minimize the size of API calls.' },
    { question: 'How frequently is Ananas updated?', answer: 'Currently, our developers update the application about every 2 weeks.' },
    { question: 'How can I delete or update my account?', answer: 'Navigate to the account page by clicking the person icon on the navigation bar. From there, you can either update your name or delete your account.' },
    { question: 'How can I setup two factor authentication?', answer: 'You can setup two factor authentication by following the instructions on this guide: <a href="https://web.njit.edu/~sd96/2fa-guide.pdf" target="_blank" rel="noopener noreferrer">2FA Guide</a>.' },

  ];

  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter FAQ items based on search term
  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="faq">
      <h3>Frequently Asked Questions</h3>
      <TextField placeholder="Search FAQ" label="Search FAQ" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth />
      <ul>
        {filteredFAQ.map((item, index) => (
          <div key={index}>
            <strong>{item.question}</strong>
             <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.answer)}}></p>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default FAQ;
