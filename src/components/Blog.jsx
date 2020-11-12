import React, { useState } from 'react';

const Blog = ({ blog }) => {
  const [showBlogDetails, setshowBlogDetails] = useState(false);

  return (
    <div style={{ margin: 16, border: '2px solid green', padding: 8 }}>
      {blog.title}
      {' '}
      <button onClick={() => setshowBlogDetails(!showBlogDetails)} type="button">
        {showBlogDetails ? 'Hide' : 'Show'}
      </button>

      {showBlogDetails && (
        <>
          <p>
            {blog.url}
          </p>
          <p>
            {blog.likes}
            {' '}
            {' '}
            <button onClick={() => null} type="button">Like</button>
          </p>
          <p>
            {blog.author}
          </p>
        </>
      )}
    </div>
  );
};

export default Blog;
