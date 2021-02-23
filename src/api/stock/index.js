import request from '@/request';

export default {
  findAllStocks({ query }) {
    const url = '/stocks';
    return request.get(url, {
      params: {
        query,
      },
    });
  },

  createStock(stock, { contentLoading = true } = {}) {
    const url = '/stocks';
    return request.post(url, stock, {
      contentLoading,
    });
  },

  updateStock(id, stock) {
    const url = `/stocks/${id}`;
    return request.put(url, stock);
  },

  deleteStock(id) {
    const url = `/stocks/${id}`;
    return request.delete(url);
  },
};
