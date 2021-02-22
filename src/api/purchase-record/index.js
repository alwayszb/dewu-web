import request from '@/request';

export default {
  findPurchaseRecordsByProduct({ articleNumber, size }) {
    const url = '/purchase-records';
    return request.get(url, {
      params: {
        articleNumber,
        size,
      },
      contentLoading: false,
    });
  },
};
