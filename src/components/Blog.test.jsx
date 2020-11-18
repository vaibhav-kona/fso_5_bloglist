import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import Blog from './Blog';

test('renders content', () => {
  const blog = {
    title: 'abc of react',
    author: 'Jai',
    url: '/abc',
    id: '123',
  };

  const handleNotification = () => {
    const abc = 3;
  };

  const setBlog = () => {
    const abc = 3;
  };

  const component = render(
    <Blog
      blog={blog}
      setBlogs={setBlog}
      setNotification={handleNotification}
    />,
  );

  expect(component.container).toHaveTextContent(
    'abc of react Show',
  );
});
