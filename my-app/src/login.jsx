import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ เพิ่ม useNavigate
import "./App.css";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // ✅ สร้าง navigate

  const validUsers = [
    { username: 'user1', password: 'password123' },
    { username: 'user2', password: 'hello123' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = validUsers.find(u => u.username === username);

    if (!user) {
      setMessage('❌ User not found');
    } else if (user.password !== password) {
      setMessage('❌ Incorrect password');
    } else {
      // ✅ ไม่ต้องขึ้นข้อความแล้ว เปลี่ยนหน้าไป Home เลย
      navigate('/home');  // ⬅️ redirect ไปหน้าที่คุณตั้งไว้
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="message">{message}</p>
    </div>
  );
}

export default Login;
