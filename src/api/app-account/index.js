import request from '@/request';

const namespace = '/app-accounts';

export default {
  findAll(options = {}) {
    const url = namespace;
    return request.get(url, {
      params: {
        ...options,
      },
    });
  },

  create(data) {
    const url = namespace;
    return request.post(url, data, {
      contentLoading: false,
    });
  },

  update(id, data) {
    const url = `${namespace}/${id}`;
    return request.put(url, data);
  },

  delete(id) {
    const url = `${namespace}/${id}`;
    return request.delete(url);
  },

  syncToken(id, captcha) {
    const url = `${namespace}/${id}/sync-token`;
    return request.post(url, null, {
      params: { captcha },
      contentLoading: false,
    });
  },
};
