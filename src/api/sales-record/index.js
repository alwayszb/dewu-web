import request from '@/request';

export default {
  createSalesRecord(salesRecord) {
    const url = '/sales-records';
    return request.post(url, salesRecord, {
      contentLoading: false,
    });
  },
  findAllSalesRecords() {
    const url = '/sales-records';
    return request.get(url);
  },
};
