import request from '@/request';

export default {
  getSellSnapshotBySpuId(spuId) {
    const url = '/sell-snapshots';
    return request.get(url, {
      params: {
        spuId,
      },
      contentLoading: false,
    });
  },
};
