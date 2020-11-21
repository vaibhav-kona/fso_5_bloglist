import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';

describe('Test that the blog is working', () => {
  let component = null;

  const handleBlogCreation = jest.fn();

  beforeEach(() => {
    component = render(
      <BlogForm handleBlogCreation={handleBlogCreation} />,
    );
  });

  test('should call the submission handler on click', () => {
    const showCreateForm = component.container.querySelector('#showCreateForm');
    fireEvent.click(showCreateForm);

    const titleInput = component.container.querySelector('#title');
    fireEvent.change(titleInput, { target: { value: 'Awesome' } });

    const authorInput = component.container.querySelector('#author');
    fireEvent.change(authorInput, { target: { value: 'Blue' } });

    const urlInput = component.container.querySelector('#url');
    fireEvent.change(urlInput, { target: { value: '/awesome' } });

    const submitForm = component.container.querySelector('#submitBlogForm');
    fireEvent.click(submitForm);

    expect(handleBlogCreation.mock.calls).toHaveLength(1);

    expect(handleBlogCreation.mock.calls[0][1])
      .toEqual({ title: 'Awesome', author: 'Blue', url: '/awesome' });
  });
});
