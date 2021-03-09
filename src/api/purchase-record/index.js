import request from '@/request';

export default {
  findPurchaseRecordsByProduct({
    articleNumber,
    size,
    overseas = false,
    demand = false,
    duration = 2,
    date,
  }) {
    const url = '/purchase-records';
    return request.get(url, {
      params: {
        articleNumber,
        size,
        overseas,
        demand,
        duration,
        date,
      },
      contentLoading: false,
    });
  },
};
