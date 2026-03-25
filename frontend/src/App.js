import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your server URL

const App = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Listen for messages from the server
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up the effect
        return () => { socket.off('message'); };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        const message = { text: input, timestamp: new Date().toISOString() };
        socket.emit('message', message);
        setInput(''); // Clear input field
    };

    return (
        <div>
            <h1>Real-Time Messaging</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{new Date(msg.timestamp).toLocaleString()}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input 
                    type='text' 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder='Type a message...' 
                    required
                />
                <button type='submit'>Send</button>
            </form>
        </div>
    );
};

export default App;