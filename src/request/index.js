import axios from 'axios';
import heyui from 'heyui';

const request = axios.create({
  baseURL: 'http://localhost:4000',
});

let loadingCount = 0;
request.interceptors.request.use(
  (config) => {
    loadingCount += 1;
    heyui.$Loading('Loading...');
    return config;
  },
  (err) => {
    Promise.reject(err);
  },
);

request.interceptors.response.use(
  (res) => {
    loadingCount -= 1;
    if (loadingCount === 0) {
      heyui.$Loading.close();
    }
    return res;
  },
  (err) => {
    Promise.reject(err);
  },
);

export default request;
