import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NameInputForm.css';

const NameInputForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    roomCode: '',
  });
  const navigate = useNavigate();

  // Handle input changes for both fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, roomCode } = formData;

    if (name && roomCode) {
      try {
        const response = await fetch('http://localhost:5000/api/enter-room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, roomCode }),
        });

        const data = await response.json();

        if (data.success) {
          navigate(`/room/${roomCode}`, { state: { name } });
        } else {
          alert('Room not found or some error occurred');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong');
      }
    }
  };

  return (
    <div className="name-input-form">
      <div className="form-container">
        <h1 className="title">Enter Room</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="roomCode">Room Code</label>
            <input
              id="roomCode"
              type="text"
              placeholder="Enter room code"
              name="roomCode"
              value={formData.roomCode}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="submit-btn">
            Enter Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameInputForm;
