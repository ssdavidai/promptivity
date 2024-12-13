import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

function GameInstructions({ onStartGame }) {
  const [instructions, setInstructions] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch(`${window.location.origin}/assets/taskmaster.txt`);
        if (!response.ok) {
          throw new Error(`Could not fetch instructions, status: ${response.status}`);
        }
        const text = await response.text();
        setInstructions(text);
      } catch (error) {
        console.error('Error fetching instructions:', error);
        setInstructions('Error loading instructions.');
      }
    };

    fetchInstructions();
  }, []);

  const handleStartClick = () => {
    if (apiKey.trim()) {
      onStartGame(apiKey.trim());
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mx-10">
      <ReactMarkdown>{instructions}</ReactMarkdown>
      <div className="mt-4">
        <input
          type="password"
          placeholder="Enter your OpenAI API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
      </div>
      <button
        onClick={handleStartClick}
        className={`mt-4 px-6 py-3 text-white rounded font-plex-mono ${
          apiKey.trim() ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!apiKey.trim()}
      >
        Start Game
      </button>
    </div>
  );
}

export default GameInstructions;