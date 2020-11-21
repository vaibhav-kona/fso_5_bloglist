import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, prettyDOM } from '@testing-library/react';

import Blog from './Blog';

describe('Test that the blog is working', () => {
  let component = null;
  const handleNotification = jest.fn();
  const setBlog = jest.fn();

  beforeEach(() => {
    const blog = {
      title: 'abc of react',
      author: 'Jai',
      url: '/abc',
      likes: 4,
      id: '123',
    };

    component = render(
      <Blog
        blog={blog}
        setBlogs={setBlog}
        setNotification={handleNotification}
      />,
    );
  });

  test('renders title and author by default', () => {
    const blogTitle = component.container.querySelector('#blogTitle');
    expect(blogTitle).toHaveTextContent('abc of react');
    const blogAuthor = component.container.querySelector('#blogAuthor');
    expect(blogAuthor).toHaveTextContent('Jai');
  });

  test('does not render blog details by default', () => {
    const blogDetails = component.container.querySelector('#blogDetails');
    expect(blogDetails).toBeNull();
  });

  test('blog details should be present when the show button is clicked', () => {
    const showButton = component.container.querySelector('#showBlogDetails');
    fireEvent.click(showButton);
    const blogDetails = component.container.querySelector('#blogDetails');
    expect(blogDetails).not.toBeNull();

    const blogUrl = component.container.querySelector('#blogUrl');
    const blogLikes = component.container.querySelector('#blogLikes');

    expect(blogLikes).toHaveTextContent('4');
    expect(blogUrl).toHaveTextContent('/abc');
  });
});
