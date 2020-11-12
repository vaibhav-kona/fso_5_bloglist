import React, { useState } from 'react';
import blogsService from '../services/blogs';

const Blog = ({ blog }) => {
  const [showBlogDetails, setshowBlogDetails] = useState(false);
  const [blogDetails, setBlogDetails] = useState(blog);
  const [isUpdating, setisUpdating] = useState(false);

  const likeBlog = async () => {
    setisUpdating(true);
    const responseData = await blogsService.likeBlog(blogDetails);
    setBlogDetails(responseData);
    setisUpdating(false);
  };

  return (
    <div style={{ margin: 16, border: '2px solid green', padding: 8 }}>
      {blogDetails.title}
      {' '}
      <button onClick={() => setshowBlogDetails(!showBlogDetails)} type="button">
        {showBlogDetails ? 'Hide' : 'Show'}
      </button>

      {showBlogDetails && (
        <>
          <p>
            {blogDetails.url}
          </p>
          <p>
            {blogDetails.likes}
            {' '}
            {' '}
            <button disabled={isUpdating} onClick={likeBlog} type="button">Like</button>
          </p>
          <p>
            {blogDetails.author}
          </p>
        </>
      )}
    </div>
  );
};

export default Blog;
