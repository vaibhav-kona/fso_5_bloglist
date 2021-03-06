import axios from 'axios';

const baseUrl = '/api/blogs';

let token = '';

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newBlog) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const likeBlog = async (blog) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.put(`${baseUrl}/${blog.id}`, { likes: blog.likes + 1 }, config);
  return response.data;
};

const deleteBlog = async (blogId) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.delete(`${baseUrl}/${blogId}`, config);
  return response.data;
};

export default {
  create, getAll, setToken, likeBlog, deleteBlog,
};
