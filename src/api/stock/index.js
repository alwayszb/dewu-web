import request from '@/request';

export default {
  findAllStocks({ status }) {
    const url = '/stocks';
    return request.get(url, {
      params: {
        status,
      },
    });
  },

  createStock(stock) {
    const url = '/stocks';
    return request.post(url, stock);
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
