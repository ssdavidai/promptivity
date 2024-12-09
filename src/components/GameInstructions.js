import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

function GameInstructions({ textFilePath }) {
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch(`${window.location.origin}${textFilePath}`);
        if (!response.ok) {
          throw new Error(`Could not fetch ${textFilePath}, status: ${response.status}`);
        }
        const text = await response.text();
        setInstructions(text);
      } catch (error) {
        console.error('Error fetching instructions:', error);
        setInstructions('Error loading instructions.');
      }
    };

    fetchInstructions();
  }, [textFilePath]);

  return (
    <div className="p-4 bg-white rounded shadow mx-10">
      <ReactMarkdown>{instructions}</ReactMarkdown>
    </div>
  );
}

export default GameInstructions;