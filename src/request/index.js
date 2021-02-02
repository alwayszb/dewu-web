import axios from 'axios';
import heyui from 'heyui';

const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE,
});

let loadingCount = 0;
request.interceptors.request.use(
  (config) => {
    const { contentLoading = true } = config;
    if (contentLoading) {
      loadingCount += 1;
      heyui.$Loading('Loading...');
    }
    return config;
  },
  (err) => {
    Promise.reject(err);
  },
);

request.interceptors.response.use(
  (res) => {
    const { contentLoading = true } = res.config;
    if (contentLoading) {
      loadingCount -= 1;
      if (loadingCount === 0) {
        setTimeout(() => {
          heyui.$Loading.close();
        }, 500);
      }
    }
    return res;
  },
  (err) => {
    Promise.reject(err);
  },
);

export default request;
