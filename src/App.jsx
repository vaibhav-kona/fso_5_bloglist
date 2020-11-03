import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const defaultFormState = () => ({
    title: '',
    author: '',
    url: '',
  });

  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [formState, setFormState] = useState(defaultFormState());

  useEffect(() => {
    blogService.getAll().then((blogsData) => setBlogs(blogsData));
  }, []);

  useEffect(() => {
    const loggedNoteappUser = window.localStorage.getItem('loggedNoteappUser');
    if (loggedNoteappUser) {
      const userFromLocalStorage = JSON.parse(loggedNoteappUser);
      setUser(userFromLocalStorage);
      blogService.setToken(userFromLocalStorage.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userData = await loginService.login({
        username, password,
      });
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(userData));
      blogService.setToken(userData.token);
      setUser(userData);
      setUsername('');
      setPassword('');
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const handleBlogCreation = (e) => {
    e.preventDefault();
    blogService.create(formState)
      .then(() => {
        blogService.getAll().then((blogsData) => setBlogs(blogsData));
      });
  };

  const handleFormFieldChange = (name, value) => {
    const formStateCopy = { ...formState };
    formStateCopy[name] = value;
    setFormState(formStateCopy);
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

  const newBlogForm = () => (
    <>
      <form onSubmit={handleBlogCreation}>
        <label htmlFor="title">
          title:
          <input
            id="title"
            name="title"
            required
            value={formState.title}
            onChange={(e) => handleFormFieldChange('title', e.target.value)}
          />
        </label>
        <label htmlFor="author">
          author:
          <input
            id="author"
            name="author"
            required
            value={formState.author}
            onChange={(e) => handleFormFieldChange('author', e.target.value)}
          />
        </label>
        <label htmlFor="url">
          url:
          <input
            id="url"
            name="url"
            required
            value={formState.url}
            onChange={(e) => handleFormFieldChange('url', e.target.value)}
          />
        </label>

        <button type="submit">Save</button>
      </form>
    </>
  );

  const isUserLoggedIn = !!(user);

  return (
    <div>
      <h2>blogs</h2>

      {!isUserLoggedIn && loginForm()}

      {isUserLoggedIn && (
        <>
          <p>
            {`${user.name || user.username} is now logged in.`}
            <button onClick={handleLogout} type="button">Logout</button>
          </p>
          {newBlogForm()}
          {blogsUI()}
        </>
      )}

    </div>
  );
};

export default App;
