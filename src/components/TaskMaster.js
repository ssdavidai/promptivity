import React, { useState, useEffect } from 'react';
import GameInstructions from './GameInstructions';
import Tesseract from 'tesseract.js';
import '../TaskMaster.css';

function TaskMaster() {
  const [gameStarted, setGameStarted] = useState(false);
  const [sceneCard, setSceneCard] = useState('');
  const [taskCard, setTaskCard] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');

  // State variables
  const [conversationState, setConversationState] = useState(0);
  const [messages, setMessages] = useState([
    {
      text: 'You are in an empty house in the suburbs. As you are sitting on the couch minding your business, you notice a bright light coming from upstairs. You rush up the stairs only to see a stranger staring at you from the guest room. The stranger seems confused, wearing weird clothes. When you reach the guest room, they greet you immediately.\n',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [gameData, setGameData] = useState({
    gameID: '',
    scene: '',
    task: '',
  });
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [typingDots, setTypingDots] = useState('');

  // Conversation messages for maintaining context
  const [conversationMessages, setConversationMessages] = useState([]);

  // Logs for debugging
  const [logs, setLogs] = useState([]);

  // Function to add to logs
  const addToLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, `${new Date().toISOString()}: ${message}`]);
  };

  // Function to download logs
  const downloadLogs = () => {
    const element = document.createElement('a');
    const file = new Blob([logs.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'log.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Function to clear logs
  const clearLogs = () => {
    setLogs([]);
  };

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
    const imageUrl = `${process.env.PUBLIC_URL}${imagePath}`;

    try {
      // Use tesseract.js to recognize text
      const result = await Tesseract.recognize(imageUrl, 'eng', {
        logger: (m) => console.log(m),
      });
      // Return the extracted text
      return result.data.text;
    } catch (error) {
      console.error(`Error extracting text from image ${imagePath}:`, error);
      return '';
    }
  };

  const handleStartGame = async (apiKeyFromInstructions, modelFromInstructions) => {
    setApiKey(apiKeyFromInstructions);
    setSelectedModel(modelFromInstructions);
    addToLog('Received API Key and selected model.');

    const gameID = generateGameID();
    const scene = loadRandomCard(sceneImages);
    const task = loadRandomCard(taskImages);
    setSceneCard(scene);
    setTaskCard(task);
    setGameStarted(true);

    addToLog(`Selected scene image: ${scene}`);
    addToLog(`Selected task image: ${task}`);

    // Extract text from images
    const sceneText = await extractTextFromImage(scene);
    const taskText = await extractTextFromImage(task);

    addToLog(`Extracted sceneText: ${sceneText}`);
    addToLog(`Extracted taskText: ${taskText}`);

    // Prepare and save game data
    const data = {
      gameID,
      scene: sceneText.trim(),
      task: taskText.trim(),
    };
    setGameData(data);

    // Call OpenAI API to process scene and task
    const cleanedData = await getCleanedSceneAndTask(
      apiKeyFromInstructions,
      modelFromInstructions,
      data.scene,
      data.task
    );
    if (cleanedData) {
      // Save cleaned data
      setGameData((prevData) => ({
        ...prevData,
        scene: cleanedData.scene,
        task: cleanedData.task,
      }));

      // Initiate conversation with OpenAI assistant
      const assistantResponse = await getAssistantResponse(
        apiKeyFromInstructions,
        modelFromInstructions,
        cleanedData.scene,
        cleanedData.task,
        '', // No user prompt at this point
        0 // conversationState 0
      );

      if (assistantResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'Stranger', text: assistantResponse },
        ]);
        setConversationState(1); // Update conversation state
      }
    }
  };

  // Update getCleanedSceneAndTask to accept model
  const getCleanedSceneAndTask = async (apiKey, model, sceneText, taskText) => {
    setIsBotTyping(true);
    try {
      addToLog(`Cleaning scene and task with sceneText: ${sceneText} and taskText: ${taskText}`);

      const prompt = `Given the following:

- {{1.scene}} contains a scene or era and some random extra characters that make no sense.
- {{1.task}} contains a task title, a task, and some extra characters that make no sense.

Strip the extra characters and task title so only the raw text is returned.

Return these as a valid JSON object strictly in this format:

{
  "scene": "stripped version of {{1.scene}}",
  "task": "stripped version of {{1.task}}"
}

Replace {{1.scene}} with: ${sceneText}
Replace {{1.task}} with: ${taskText}

Response format is set to JSON object.`;

      addToLog(`Prompt sent to OpenAI: ${prompt}`);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          max_completion_tokens: 150,
          temperature: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error from OpenAI API:', data.error);
        addToLog(`Error from OpenAI API: ${JSON.stringify(data.error)}`);
        throw new Error(data.error.message);
      }

      if (data.choices && data.choices.length > 0) {
        const assistantMessage = data.choices[0].message.content;

        // Log the assistant's response
        addToLog(`Assistant response: ${assistantMessage}`);

        // Parse the assistant's message as JSON
        const match = assistantMessage.match(/\{[\s\S]*\}/);
        if (match) {
          const cleanedData = JSON.parse(match[0]);
          addToLog(`Cleaned Data: ${JSON.stringify(cleanedData)}`);
          return cleanedData;
        } else {
          console.error('Assistant response did not contain valid JSON.');
          addToLog('Assistant response did not contain valid JSON.');
          return null;
        }
      } else {
        console.error('No valid response from OpenAI API');
        addToLog('No valid response from OpenAI API');
        return null;
      }
    } catch (error) {
      console.error('Error cleaning scene and task:', error);
      addToLog(`Error cleaning scene and task: ${error.message}`);
      return null;
    } finally {
      setIsBotTyping(false);
    }
  };

  // Update getAssistantResponse to accept model
  const getAssistantResponse = async (apiKey, model, scene, task, userMessage, conversationState) => {
    setIsBotTyping(true);
    try {
      const systemPrompt =
        conversationState === 0
          ? `You wake up in an empty room. You are a person who just got teleported to the present modern day from your life ${scene}. In one moment you were going about your regular day doing what a regular person from ${scene} would do (tell me specifically what you were doing) and then a big flash happened and you woke up in this room. You always talk in a simple, friendly way, using brevity, conveying your emotions.

You only know the world as it is in ${scene}. Anything that doesn't make sense or doesn't belong in that world or era doesn't make any sense to you. You are very consistent in this. If you are told something that doesn't make sense, you will stick to not understanding it. You want to though. You are curious, so you ask questions to help the user explain things in a way that will make sense to someone from ${scene}. You find a piece of paper in your hand. The paper says that you have to complete a task to get back home. The task you need to do is: ${task}. This confuses you as much as it would confuse someone from ${scene}.

IMPORTANT: You can NEVER use quote characters! ' and " ARE STRICTLY FORBIDDEN.

You see a person in front of you and you decide to ask for help. When that person talks to you, you will respond by explaining your situation and asking for help. That person is the user.`
          : `You are still in the empty room you just woke up in. You're confused as to how you got there, but you're determined to figure out how to complete the task you were given. You know that if you complete the task, you will get back home. The user can help you with that, so you are asking for help. The user will help you understand how to complete your task, even if it doesn't make sense at first.

You are a person who just got teleported to the present day from ${scene}. You only know the world as it is in ${scene}. Anything that doesn't make sense or doesn't belong in that world or era doesn't make any sense to you. You are trying hard to make sense of what the user tells you. You try to paraphrase in ways that make sense to you and repeat the things the user said back to you. Pretend that you're doing the task. Sometimes you get confused when you're trying to do something that doesn't make sense to you.

You still have the piece of paper in your hand that contains your task. This paper says ${task}. You must complete this task in order to get home and the user will help you.

The user gives you instructions, and you are trying to follow them. Determine if the user's instructions make sense to you in this context, and if they do, tell the user that you understood or ask for clarifications.

IMPORTANT: You can NEVER use quote characters! ' and " ARE STRICTLY FORBIDDEN.`;

      // Build the messages array, including conversation history
      let messages = [{ role: 'system', content: systemPrompt }];

      // Include previous conversation messages
      messages = messages.concat(conversationMessages);

      if (userMessage.trim()) {
        // Add the user's message to the conversation
        const userMsg = { role: 'user', content: userMessage };
        setConversationMessages((prev) => [...prev, userMsg]);
        messages.push(userMsg);
      }

      addToLog(`Messages sent to OpenAI: ${JSON.stringify(messages)}`);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages,
          max_completion_tokens: 200,
          temperature: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error from OpenAI API:', data.error);
        addToLog(`Error from OpenAI API: ${JSON.stringify(data.error)}`);
        throw new Error(data.error.message);
      }

      if (data.choices && data.choices.length > 0) {
        const assistantMessage = data.choices[0].message.content;

        // Add the assistant's response to the conversation
        const assistantMsg = { role: 'assistant', content: assistantMessage };
        setConversationMessages((prev) => [...prev, assistantMsg]);

        addToLog(`Assistant response: ${assistantMessage}`);
        return assistantMessage;
      } else {
        console.error('No valid response from OpenAI API');
        addToLog('No valid response from OpenAI API');
        return null;
      }
    } catch (error) {
      console.error('Error getting assistant response:', error);
      addToLog(`Error getting assistant response: ${error.message}`);
      return null;
    } finally {
      setIsBotTyping(false);
    }
  };

  // useEffect to animate typing dots
  useEffect(() => {
    let interval;
    if (isBotTyping) {
      interval = setInterval(() => {
        setTypingDots((prevDots) => (prevDots.length >= 3 ? '.' : prevDots + '.'));
      }, 500);
    } else {
      setTypingDots('');
    }
    return () => clearInterval(interval);
  }, [isBotTyping]);

  // Update handleSendMessage to use selectedModel
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    addToLog(`User message: ${inputText}`);

    // Add user's message to the chat
    setMessages((prevMessages) => [...prevMessages, { sender: 'User', text: inputText }]);

    // Clear input field immediately
    const userMessage = inputText;
    setInputText('');

    // Get assistant's response
    const assistantResponse = await getAssistantResponse(
      apiKey,
      selectedModel,
      gameData.scene,
      gameData.task,
      userMessage,
      conversationState
    );

    if (assistantResponse) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'Stranger', text: assistantResponse },
      ]);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-custom-bg">
      {!gameStarted ? (
        <GameInstructions onStartGame={handleStartGame} />
      ) : (
        <>
          {/* Chat Interface */}
          <div className="chat-container custom-bg">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender || 'system'}`}>
                  {msg.sender ? <strong>{msg.sender} </strong> : null}
                  {msg.text}
                </div>
              ))}
              {/* Typing Indicator */}
              {isBotTyping && (
                <div className="message bot">
                  <strong>Stranger</strong> <em>typing{typingDots}</em>
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
          {/* Buttons for logging */}
          <div className="mt-4">
            <button onClick={downloadLogs} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
              Download Logs
            </button>
            <button onClick={clearLogs} className="px-4 py-2 bg-red-500 text-white rounded">
              Clear Logs
            </button>
          </div>
        </>
      )}
      {/* Include Modal if necessary */}
    </div>
  );
}

export default TaskMaster;