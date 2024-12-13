import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

function GameInstructions({ onStartGame }) {
  const [instructions, setInstructions] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');

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
      onStartGame(apiKey.trim(), selectedModel);
    }
  };

  const models = [
    'gpt-3.5-turbo',
    'gpt-4o',
    'gpt-4o-mini'
  ];

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
      <div className="mt-4">
        <label htmlFor="model-select" className="block text-gray-700 mb-2">
          Select AI Model:
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
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