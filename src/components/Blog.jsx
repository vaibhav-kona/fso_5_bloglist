import React, { useState } from 'react';
import { shape, func } from 'prop-types';
import blogsService from '../services/blogs';

const Blog = ({ blog, setBlogs, setNotification }) => {
  const [showBlogDetails, setshowBlogDetails] = useState(false);
  const [blogDetails, setBlogDetails] = useState(blog);
  const [isUpdating, setisUpdating] = useState(false);

  const likeBlog = async () => {
    setisUpdating(true);
    const responseData = await blogsService.likeBlog(blogDetails);
    setBlogDetails(responseData);
    setisUpdating(false);
  };

  const deleteBlog = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this blog?');
    if (isConfirmed) {
      setisUpdating(true);
      try {
        await blogsService.deleteBlog(blogDetails.id);
        const blogsData = await blogsService.getAll();
        setBlogs(blogsData);
        setNotification({ type: 'success', message: 'Blog is now deleted!' });
      } catch (error) {
        setNotification({ type: 'error', message: error.message });
      }
      setisUpdating(false);
    }
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
          <button
            onClick={() => deleteBlog(blogDetails.id)}
            type="button"
          >
            Remove
          </button>
        </>
      )}
    </div>
  );
};

// eslint-disable-next-line react/no-typos
Blog.propTypes = {
  blog: shape({}).isRequired,
  setBlogs: func.isRequired,
  setNotification: func.isRequired,
};

export default Blog;
