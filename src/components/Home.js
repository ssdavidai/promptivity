import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const gameModes = [
    { name: 'Alien Assembly', path: '/alien-assembly' },
    { name: 'Teach Me', path: '/teach-me' },
    { name: 'Task Master', path: '/task-master' },
  ];

  return (
    <div className="bg-custom-bg min-h-screen flex items-center justify-center px-4">
      <div className="absolute top-0 -left-4 w-2/3 h-2/3 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-2/3 h-2/3 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-2/3 h-2/3 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-lg">
        <div className="m-4 sm:m-8 relative space-y-4">
          <h1 className="text-3xl sm:text-4xl font-press-start text-center mb-8 text-white">
            Promptivity
          </h1>
          {gameModes.map((mode) => (
            <div
              key={mode.name}
              className="mx-5px p-4 sm:p-5 bg-white rounded-lg flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-8"
            >
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold">{mode.name}</h2>
              </div>
              <div>
                <button
                  onClick={() => navigate(mode.path)}
                  className="px-4 py-2 sm:px-6 bg-blue-500 text-white rounded hover:bg-blue-700 font-plex-mono"
                >
                  Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;