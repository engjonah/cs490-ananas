import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DocumentationPage from '../../pages/DocumentationPage';

describe('DocumentationPage component', () => {
  it('renders all sections correctly', () => {
    const { container, getByText, getByAltText } = render(
      <DocumentationPage />
    );

    // Check if the title is rendered
    expect(getByText('Documentation')).toBeInTheDocument();

    // Ensures section are rendered
    const sections = ['User Guide', 'Developer Guide', 'Disclosures'];
    let section;
    for (let i = 0; i < sections.length; i++) {
      section = sections[i];
      expect(getByText(section).toBeInTheDocument);
    }

    // Ensures subsections are rendered
    const subsections = [
      'Frequently Asked Questions',
      'MERN',
      'Translation',
      'Authentication',
    ];
    let subsection;
    for (let i = 0; i < subsections.length; i++) {
      subsection = subsections[i];
      expect(getByText(subsection)).toBeInTheDocument();
    }

    // Ensures major items from subsections are rendered (excludes FAQ section since it's independently tested)
    const link = getByText('Download our user guide');
    expect(link).toBeInTheDocument();
    const thumbnail = getByAltText('Video Thumbnail');
    fireEvent.click(thumbnail);
    const videoElement = container.querySelector('iframe');
    expect(videoElement).toBeInTheDocument();
    expect(videoElement).toHaveAttribute(
      'src',
      'https://www.youtube.com/embed/JVIpPHcqXLY?si=_a8G9yAh9Pe4-qQ5'
    );
    const majorItems = [
      'MongoDB:',
      'Express.js:',
      'React.js:',
      'Node.js:',
      'GPT-3.5 Turbo Model',
      'Firebase API',
      'User Details:',
      'Translation History:',
    ];
    let majorItem;
    for (let i = 0; i < majorItems.length; i++) {
      majorItem = majorItems[i];
      expect(getByText(majorItem)).toBeInTheDocument();
    }

    // Tests user guide download
    expect(link.getAttribute('href')).toContain('AnanasUserGuide');
  });
});
