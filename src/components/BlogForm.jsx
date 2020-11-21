import { func } from 'prop-types';
import React, { useState } from 'react';

const BlogForm = ({ handleBlogCreation }) => {
  const defaultFormState = () => ({
    title: '',
    author: '',
    url: '',
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formState, setFormState] = useState(defaultFormState());

  const handleFormFieldChange = (name, value) => {
    const formStateCopy = { ...formState };
    formStateCopy[name] = value;
    setFormState(formStateCopy);
  };

  return (
    <>
      <button
        id="showCreateForm"
        type="button"
        onClick={() => setShowCreateForm(true)}
        style={{ display: showCreateForm ? 'none' : '' }}
      >
        Create New Blog
      </button>
      {showCreateForm && (
        <form onSubmit={(e) => handleBlogCreation(e, formState, setShowCreateForm)}>
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

          <button id="submitBlogForm" type="submit">Save</button>
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
};

BlogForm.propTypes = {
  handleBlogCreation: func.isRequired,
};

export default BlogForm;
