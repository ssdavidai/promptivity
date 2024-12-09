import React, { useState, useEffect } from 'react';

function Timer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }
    const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  return (
    <div className="text-center text-2xl text-white my-5">
      Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
    </div>
  );
}

export default Timer;