import React, { useState } from 'react';
import GameInstructions from './GameInstructions';
import Timer from './Timer';
import Modal from './Modal';

function TeachMe() {
  const [gameStarted, setGameStarted] = useState(false);
  const [constraints, setConstraints] = useState([]);
  const [instructionCard, setInstructionCard] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Arrays of image paths
  const constraintImages = [
    '/assets/constraints/1.png',
    '/assets/constraints/2.png',
    '/assets/constraints/3.png',
    '/assets/constraints/4.png',
    '/assets/constraints/5.png',
    '/assets/constraints/6.png',
    '/assets/constraints/7.png',
    '/assets/constraints/8.png',
    '/assets/constraints/9.png',
    '/assets/constraints/10.png',
    '/assets/constraints/11.png',
    '/assets/constraints/12.png',
    '/assets/constraints/13.png',
    '/assets/constraints/14.png',
    '/assets/constraints/15.png',
    '/assets/constraints/16.png'
  ];

  const instructionImages = [
    '/assets/teachme/1.png',
    '/assets/teachme/2.png',
    '/assets/teachme/3.png',
    '/assets/teachme/4.png',
    '/assets/teachme/5.png',
    '/assets/teachme/6.png',
    '/assets/teachme/7.png',
    '/assets/teachme/8.png',
    '/assets/teachme/9.png',
    '/assets/teachme/10.png',
    '/assets/teachme/11.png',
    '/assets/teachme/12.png',
    '/assets/teachme/13.png',
    '/assets/teachme/14.png',
    '/assets/teachme/15.png',
    '/assets/teachme/16.png'
  ];

  // Function to load random constraints
  const loadRandomCards = (imagesArray, count) => {
    const selectedCards = [];
    const availableImages = [...imagesArray];

    for (let i = 0; i < count; i++) {
      if (availableImages.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableImages.length);
      const randomImage = availableImages.splice(randomIndex, 1)[0];
      selectedCards.push(randomImage);
    }

    return selectedCards;
  };

  // Function to load a random instruction card
  const loadRandomCard = (imagesArray) => {
    const randomIndex = Math.floor(Math.random() * imagesArray.length);
    return imagesArray[randomIndex];
  };

  const handleStartGame = () => {
    const loadedConstraints = loadRandomCards(constraintImages, 3);
    setConstraints(loadedConstraints);
    setGameStarted(true);
  };

  const handleDrawInstruction = () => {
    const instruction = loadRandomCard(instructionImages);
    setInstructionCard(instruction);
  };

  const handleTimeUp = () => {
    setShowModal(true);
  };

  const handleAnotherRound = () => {
    setGameStarted(false);
    setShowModal(false);
    setConstraints([]);
    setInstructionCard('');
  };

  const handleQuit = () => {
    window.location.href = '/';
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-custom-bg">

      {!gameStarted ? (
        <>
          <GameInstructions textFilePath="/assets/teachme.txt" />
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
          <div className="mt-4 space-y-4 mb-10">
            {constraints.map((constraint, index) => (
              <div key={index} className="card-container">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <img
                    src={constraint}
                    alt={`Constraint ${index + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            ))}
            {!instructionCard ? (
              <div className="w-full flex justify-center">
                <button
                  onClick={handleDrawInstruction}
                  className="mt-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700 font-plex-mono"
                >
                  Draw Instruction Card
                </button>
              </div>
            ) : (
              <div className="card-container mb-10">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <img
                    src={instructionCard}
                    alt="Instruction Card"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
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

export default TeachMe;