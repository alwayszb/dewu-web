import request from '@/request';

export default {
  findAllAutoOrders({ query }) {
    const url = '/auto-orders';
    return request.get(url, {
      params: {
        query,
      },
    });
  },

  createAutoOrder(autoOrder, { contentLoading = true } = {}) {
    const url = '/auto-orders';
    return request.post(url, autoOrder, {
      contentLoading,
    });
  },

  updateAutoOrder(id, autoOrder) {
    const url = `/auto-orders/${id}`;
    return request.put(url, autoOrder);
  },

  deleteAutoOrder(id) {
    const url = `/auto-orders/${id}`;
    return request.delete(url);
  },
};
