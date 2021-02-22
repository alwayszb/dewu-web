import request from '@/request';

export default {
  getSellSnapshotByArticleNumber(articleNumber) {
    const url = '/sell-snapshots';
    return request.get(url, {
      params: {
        articleNumber,
      },
      contentLoading: false,
    });
  },
};
