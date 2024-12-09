import React from 'react';

function Modal({ show, onAnotherRound, onQuit }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-2xl mb-4">Game Ended</h2>
        <button
          onClick={onAnotherRound}
          className="mr-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Another Round
        </button>
        <button
          onClick={onQuit}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Quit
        </button>
      </div>
    </div>
  );
}

export default Modal;