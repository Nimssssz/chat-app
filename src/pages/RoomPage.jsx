import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './RoomPage.css';

const RoomPage = () => {
  const { roomCode } = useParams();
  const { state } = useLocation();
  const { name } = state || {}; // Default to empty object if state is undefined

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  // Send message to backend and update the state
  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = { name, text: message, timestamp: new Date().toLocaleTimeString() };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');

      try {
        await axios.post('/api/messages', { roomCode, name, text: message });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Fetch users and messages from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, messageResponse] = await Promise.all([
          axios.get(`/api/room/${roomCode}/users`),
          axios.get(`/api/room/${roomCode}/messages`)
        ]);

        setUsers(Array.isArray(userResponse.data) ? userResponse.data : []);
        setMessages(Array.isArray(messageResponse.data) ? messageResponse.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [roomCode]);

  return (
    <div className="room-page">
      <div className="chat-container">
        <h2 className="room-code">Room Code: {roomCode}</h2>

        <div className="users-list">
          <h3>Users in the Room:</h3>
          <ul>
            {users.length > 0 ? (
              users.map((user, index) => (
                <li key={index}>{user.name}</li>
              ))
            ) : (
              <li>No users found</li>
            )}
          </ul>
        </div>

        <div className="chat-window">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="message">
                <strong>{msg.name}:</strong> {msg.text} <span className="timestamp">({msg.timestamp})</span>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>

        <div className="message-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
