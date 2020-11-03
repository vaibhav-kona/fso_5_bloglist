import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    blogService.getAll().then((blogsData) => setBlogs(blogsData));
  }, []);

  useEffect(() => {
    const loggedNoteappUser = window.localStorage.getItem('loggedNoteappUser');
    if (loggedNoteappUser) {
      const userFromLocalStorage = JSON.parse(loggedNoteappUser);
      setUser(userFromLocalStorage);
      blogService.setToken(userFromLocalStorage);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userData = await loginService.login({
        username, password,
      });
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
      blogService.setToken(userData.token);
      setUser(userData);
      setUsername('');
      setPassword('');
    } catch (error) {
      throw new Error(error);
    }

    console.log('logging in with', username, password);
  };

  const handleLogout = () => {
    window.localStorage.clear();
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogsUI = () => (
    <>
      {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
    </>
  );

  const isUserLoggedIn = user && user !== null;

  return (
    <div>
      <h2>blogs</h2>

      {!isUserLoggedIn && loginForm()}

      {isUserLoggedIn && (
        <>
          <p>
            {`${user.name} is now logged in.`}
            <button onClick={handleLogout} type="button">Logout</button>
          </p>
          {blogsUI()}
        </>
      )}

    </div>
  );
};

export default App;
