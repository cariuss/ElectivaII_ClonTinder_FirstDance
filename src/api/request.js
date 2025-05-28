import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const getAuthToken = () => {
  try {
    return localStorage.getItem("token"); // ✅ Ahora busca en localStorage
  } catch (e) {
    console.warn("LocalStorage unavailable:", e);
    return null;
  }
};

const buildQueryString = (params) => {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : '';
};

const request = async (
  method,
  module,
  useAuth = true,
  queryParams = {},
  urlParams = '',
  body = null,
  extraHeaders = {}
) => {
  const url = `${BASE_URL}/${module}${urlParams ? `/${urlParams}` : ''}${buildQueryString(queryParams)}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(useAuth && { Authorization: `Bearer ${getAuthToken()}` }),
    ...extraHeaders,
  };

  const config = {
    method: method.toLowerCase(),
    url,
    headers,
    ...(body && { data: body }),
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (err) {
    console.error('API Error:', err);
    throw err.response?.data || err.message;
  }
};

export default request;
