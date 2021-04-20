import request from '@/request';

const namespace = '/du-api';

export default {
  sendCaptcha(mobile) {
    const url = `${namespace}/captcha`;
    return request.get(url, {
      params: { mobile },
      contentLoading: false,
    });
  },

  checkUser(duToken) {
    const url = `${namespace}/check-user`;
    return request.get(url, {
      params: { duToken },
    });
  },
};
