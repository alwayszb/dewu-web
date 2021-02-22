import axios from 'axios';
import Vue from 'vue';
import store from '@/store';

const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE,
});

const showNotice = ({ key = 'default', type = 'error', title, description }) => {
  Vue.prototype.$notification.close(key);
  Vue.prototype.$notification[type]({ key, message: title, description });
};

request.interceptors.request.use(
  (config) => {
    const { contentLoading = true } = config;
    if (contentLoading) {
      store.commit('showLoading');
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
      store.commit('hideLoading');
    }
    return res;
  },
  (err) => {
    store.commit('hideLoading');
    showNotice({
      title: '请求失败',
      description: err.message,
    });
    Promise.reject(err);
  },
);

export default request;
