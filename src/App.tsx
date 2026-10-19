import { useEffect, useState } from 'react';
import { getCourses } from './api/courses';
import { loginUser, logoutUser } from './api/auth';
import type { Course } from './types';

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [error, setError] = useState('');

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch((err) => console.error('Failed to load courses:', err));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginUser({ email, password });
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>IT ELECTIVE 4 - GT4 Part 2</h1>

      {isLoggedIn ? (
        <div>
          <p>Status: <strong>Authenticated</strong></p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '300px' }}>
          <h3>Login</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h2>Course List</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.code}>
            <strong>{course.code}</strong>: {course.title} ({course.units} units - {course.semester})
          </li>
        ))}
      </ul>
    </div>
  );
}