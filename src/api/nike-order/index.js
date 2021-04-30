import request from '@/request';

const namespace = '/nike-orders';

export default {
  findAll(options = {}) {
    const url = namespace;
    return request.get(url, {
      params: {
        ...options,
      },
    });
  },
};
