import React, { useState } from 'react';
import GameInstructions from './GameInstructions';
import Timer from './Timer';
import Modal from './Modal';
import alienInstructions from './assets/alien.txt';

function AlienAssembly() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cardImage, setCardImage] = useState('');

  // Array of image paths
  const alienImages = [
    '/assets/alien/1.png',
    '/assets/alien/2.png',
    '/assets/alien/3.png',
    '/assets/alien/4.png',
    '/assets/alien/5.png',
    '/assets/alien/6.png',
    '/assets/alien/7.png',
    '/assets/alien/8.png',
    '/assets/alien/9.png',
    '/assets/alien/10.png',
    '/assets/alien/11.png',
    '/assets/alien/12.png',
    '/assets/alien/13.png',
    '/assets/alien/14.png',
    '/assets/alien/15.png',
    '/assets/alien/16.png',
    '/assets/alien/17.png',
    '/assets/alien/18.png',
    '/assets/alien/19.png',
    '/assets/alien/20.png',
    '/assets/alien/21.png',
    '/assets/alien/22.png',
    '/assets/alien/23.png',
    '/assets/alien/24.png'
  ];

  const handleStartGame = () => {
    setGameStarted(true);
    const card = loadRandomCard(alienImages);
    setCardImage(card);
  };

  const handleTimeUp = () => {
    setShowModal(true);
  };

  const handleAnotherRound = () => {
    setGameStarted(false);
    setShowModal(false);
    setCardImage('');
  };

  const handleQuit = () => {
    window.location.href = '/';
  };

  const loadRandomCard = (imagesArray) => {
    const randomIndex = Math.floor(Math.random() * imagesArray.length);
    return imagesArray[randomIndex];
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-custom-bg">
        

      {!gameStarted ? (
        <>
          <GameInstructions textFilePath="/assets/alien.txt" />
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
          <div className="mt-4 p-4 bg-white rounded shadow mb-5 mx-5px">
        
            <img src={cardImage} alt="Secret Card" className="max-w-full h-auto" />
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

export default AlienAssembly;