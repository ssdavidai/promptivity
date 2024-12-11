import React, { useState, useEffect } from 'react';
import GameInstructions from './GameInstructions';
import Modal from './Modal';
import Tesseract from 'tesseract.js';
import '../TaskMaster.css';

function TaskMaster() {
  const [gameStarted, setGameStarted] = useState(false);
  const [sceneCard, setSceneCard] = useState('');
  const [taskCard, setTaskCard] = useState('');
  const [showModal, setShowModal] = useState(false);

// State variables
const [conversationState, setConversationState] = useState(0);
const [threadID, setThreadID] = useState('');
const [messages, setMessages] = useState([
  { 
    text: 'Egy szobában vagy, veled szemben pedig egy ismeretlen alak. Úgy tűnik borzasztóan össze van zavarodva, és nem tudja mit csináljon. Furcsán van felöltözve, mintha nem idevalósi lenne. Egy papírdarabot szorongat a kezében. Úgy döntesz, köszönsz neki. \n',
  },
]);
const [inputText, setInputText] = useState('');
const [gameData, setGameData] = useState({
  gameID: '',
  scene: '',
  task: '',
});
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

  // Function to generate a unique 16-character game ID
  const generateGameID = () => {
    return Math.random().toString(36).substr(2, 16);
  };

  const extractTextFromImage = async (imagePath) => {
    // Construct the image URL
    const imageUrl = `${process.env.PUBLIC_URL}${imagePath}`;
    
    try {
      // Use tesseract.js to recognize text
      const result = await Tesseract.recognize(
        imageUrl,
        'eng',
        { logger: m => console.log(m) }
      );
      // Return the extracted text
      return result.data.text;
    } catch (error) {
      console.error(`Error extracting text from image ${imagePath}:`, error);
      return '';
    }
  };

  const handleStartGame = async () => {
    const gameID = generateGameID();
    const scene = loadRandomCard(sceneImages);
    const task = loadRandomCard(taskImages);
    setSceneCard(scene);
    setTaskCard(task);
    setGameStarted(true);

    // Extract text from images
    const sceneText = await extractTextFromImage(scene);
    const taskText = await extractTextFromImage(task);

    // Prepare and save game data
    const data = {
      gameID,
      scene: sceneText.trim(),
      task: taskText.trim(),
    };
    setGameData(data);
  };

  // New state variables for typing indicator
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [typingDots, setTypingDots] = useState('');

  // useEffect to animate typing dots
  useEffect(() => {
    let interval;
    if (isBotTyping) {
      interval = setInterval(() => {
        setTypingDots((prevDots) => {
          if (prevDots.length >= 3) {
            return '.';
          } else {
            return prevDots + '.';
          }
        });
      }, 500);
    } else {
      setTypingDots('');
    }
    return () => clearInterval(interval);
  }, [isBotTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user's message to the chat
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: inputText }]);

    // Clear input field immediately
    setInputText('');

       // Introduce a 1-second delay before showing the typing indicator
       setTimeout(() => {
        // Set isBotTyping to true to display the typing indicator
        setIsBotTyping(true);
      }, 1000); // 1000 milliseconds = 1 second
  
    // Prepare data to send
    const data = {
      gameID: gameData.gameID,
      scene: gameData.scene,
      task: gameData.task,
      prompt: inputText,
      thread_ID: threadID,
    };

    // Determine the URL
    const url =
      conversationState === 0
        ? 'https://hook.us2.make.com/3dfl33w5427tc1j44kads58rvg4lksy7'
        : 'https://hook.us2.make.com/3om7yui7fybqtcm3prd1d6aqb1cysv0j';

    // Send data to the webhook
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const webhookData = await response.json();

      // Save threadID
      if (webhookData.thread_ID) {
        setThreadID(webhookData.thread_ID);
      }

      // Add bot's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: webhookData.response },
      ]);

      // Update conversationState
      if (conversationState === 0) {
        setConversationState(1);
      }
    } catch (error) {
      console.error('Error sending data to webhook:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'An error occurred. Please try again later.' },
      ]);
    } finally {
      // Set isBotTyping to false after response is received
      setIsBotTyping(false);
    }
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
          {/* Chat Interface */}
          <div className="chat-container custom-bg">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender || 'system'}`}>
                  {msg.sender ? (
                    <strong>{msg.sender} ~ $ </strong>
                  ) : null}
                  {msg.text}
                </div>
              ))}
              {/* Typing Indicator */}
              {isBotTyping && (
                <div className="message bot">
                  <strong>bot ~ $</strong> <em>typing{typingDots}</em>
                </div>
              )}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                autoFocus
              />
              <div className="cursor-blink">|</div>
            </div>
          </div>
        </>
      )}
      {/* Include Modal if necessary */}
    </div>
  );
}

export default TaskMaster;