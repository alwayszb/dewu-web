import request from '@/request';

export default {
  capturePurchaseRecords({ articleNumber, captureAll = false }) {
    const url = '/capture/capture-sold-list';
    return request.get(url, {
      params: {
        articleNumber,
        captureAll,
      },
    });
  },

  captureDetail(articleNumber) {
    const url = '/capture/capture-detail';
    return request.get(url, {
      params: {
        articleNumber,
      },
    });
  },
};
