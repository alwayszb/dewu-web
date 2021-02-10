import request from '@/request';

export default {
  findPurchaseRecordsByProduct({ articleNumber, size }, { page = 0, limit = 100000 } = {}) {
    const url = '/purchase-records';
    return request.get(url, {
      params: {
        articleNumber,
        size,
        page,
        limit,
      },
      contentLoading: false,
    });
  },
};
