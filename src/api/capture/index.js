import request from '@/request';

export default {
  capturePurchaseRecords({ articleNumber, captureAll = false, contentLoading }) {
    const url = '/capture/capture-sold-list';
    return request.get(url, {
      params: {
        articleNumber,
        captureAll,
      },
      contentLoading,
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
