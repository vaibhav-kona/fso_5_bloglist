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
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const handleNotification = (type, message) => {
    console.log('message : ', message);
    setNotification({ type, message });
    setTimeout(() => {
      setFormState({ type: '', message: '' });
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userData = await loginService.login({
        username, password,
      });
      const successMessage = 'Success! You are now logged in.';
      handleNotification('success', successMessage);
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(userData));
      blogService.setToken(userData.token);
      setUser(userData);
      setUsername('');
      setPassword('');
    } catch (error) {
      handleNotification('error', error.message);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const handleBlogCreation = async (e) => {
    e.preventDefault();
    try {
      await blogService.create(formState);
      const successMessage = `A new blog ${formState.title} is now created by ${formState.title}`;
      handleNotification('success', successMessage);
      const blogsData = await blogService.getAll();
      setBlogs(blogsData);
      setShowCreateForm(false);
    } catch (error) {
      handleNotification('error', error.message);
    }
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
      <button
        type="button"
        onClick={() => setShowCreateForm(true)}
        style={{ display: showCreateForm ? 'none' : '' }}
      >
        Create New Blog
      </button>
      {showCreateForm && (
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
      )}
      <button
        type="button"
        onClick={() => setShowCreateForm(false)}
        style={{ display: showCreateForm ? '' : 'none' }}
      >
        Cancel
      </button>
    </>
  );

  const isUserLoggedIn = !!(user);

  return (
    <div>
      <h2>blogs</h2>

      {notification.message && (
        <p
          style={notification.type === 'error'
            ? {
              color: 'red',
              border: '4px solid red',
              backgroundColor: 'lightgray',
              height: 40,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 16,
              fontWeight: 500,
              fontSize: 24,
            }
            : {
              color: 'green',
              border: '2px dashed green',
              backgroundColor: 'lightgray',
              height: 40,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 16,
              fontWeight: 500,
              fontSize: 24,
            }}
        >
          {notification.message}
        </p>
      )}

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
