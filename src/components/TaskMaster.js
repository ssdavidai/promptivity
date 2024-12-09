import React, { useState } from 'react';
import GameInstructions from './GameInstructions';
import Timer from './Timer';
import Modal from './Modal';

function TaskMaster() {
  const [gameStarted, setGameStarted] = useState(false);
  const [sceneCard, setSceneCard] = useState('');
  const [taskCard, setTaskCard] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Arrays of image paths
  const sceneImages = [
    '/assets/scene/1.png',
    '/assets/scene/2.png',
    '/assets/scene/3.png',
    '/assets/scene/4.png',
    '/assets/scene/5.png',
    '/assets/scene/6.png',
    '/assets/scene/7.png',
    '/assets/scene/8.png',
    '/assets/scene/9.png',
    '/assets/scene/10.png',
    '/assets/scene/11.png',
    '/assets/scene/12.png',
    '/assets/scene/13.png',
    '/assets/scene/14.png',
    '/assets/scene/15.png',
    '/assets/scene/16.png',
    // Add more scene images as needed
  ];

  const taskImages = [
    '/assets/task/1.png',
    '/assets/task/2.png',
    '/assets/task/3.png',
    '/assets/task/4.png',
    '/assets/task/5.png',
    '/assets/task/6.png',
    '/assets/task/7.png',
    '/assets/task/9.png',
    '/assets/task/10.png',
    '/assets/task/11.png',
    '/assets/task/12.png',
    '/assets/task/13.png',
    '/assets/task/14.png',
    '/assets/task/15.png',
    '/assets/task/16.png',
    // Add more task images as needed
  ];

  // Function to load a random card
  const loadRandomCard = (imagesArray) => {
    const randomIndex = Math.floor(Math.random() * imagesArray.length);
    return imagesArray[randomIndex];
  };

  const handleStartGame = () => {
    const scene = loadRandomCard(sceneImages);
    const task = loadRandomCard(taskImages);
    setSceneCard(scene);
    setTaskCard(task);
    setGameStarted(true);
  };

  const handleTimeUp = () => {
    setShowModal(true);
  };

  const handleAnotherRound = () => {
    setGameStarted(false);
    setShowModal(false);
    setSceneCard('');
    setTaskCard('');
  };

  const handleQuit = () => {
    window.location.href = '/';
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-custom-bg">

      {!gameStarted ? (
        <>
          <GameInstructions textFilePath="/assets/taskmaster.txt" />
          <button
            onClick={handleStartGame}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-700 font-plex-mono"
          >
            Start Game
          </button>
        </>
      ) : (
        <>
          <div className="font-press-start">
            <Timer duration={300} onTimeUp={handleTimeUp} />
          </div>
          <button
            onClick={handleQuit}
            className="mt-4 px-6 py-3 bg-red-500 text-white rounded hover:bg-red-700 font-plex-mono"
          >
            Quit
          </button>
          <div className="mt-4 space-y-4 mb-10 mx-5px">
            <div className="card-container">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <h3 className="text-xl font-semibold p-4">Scene Card:</h3>
                <img
                  src={sceneCard}
                  alt="Scene Card"
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="card-container mb-10">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <h3 className="text-xl font-semibold p-4">Task Card:</h3>
                <img
                  src={taskCard}
                  alt="Task Card"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </>
      )}
      <Modal
        show={showModal}
        onAnotherRound={handleAnotherRound}
        onQuit={handleQuit}
      />
    </div>
  );
}

export default TaskMaster;