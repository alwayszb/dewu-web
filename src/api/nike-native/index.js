import request from '@/request';

const namespace = '/nike-api';

export default {
  refreshToken(appAccountId) {
    const url = `${namespace}/token-refresh`;
    return request.get(url, {
      params: { appAccountId },
    });
  },

  getUserInfo(appAccountId) {
    const url = `${namespace}/user-info`;
    return request.get(url, {
      params: { appAccountId },
    });
  },
};
