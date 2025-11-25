import axios from 'axios';


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  
  // List of public endpoints that DON'T need authentication
  const publicEndpoints = ['/api', '/api/users/login', '/api/users/register'];
  
  // Only add token if this is NOT a public endpoint
  const isPublicEndpoint = publicEndpoints.some(endpoint => config.url.includes(endpoint));
  
  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;