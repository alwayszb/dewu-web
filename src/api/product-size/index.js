import request from '@/request';

export default {
  findSizesBySpuId(spuId) {
    const url = '/product-sizes';
    return request.get(url, {
      params: {
        spuId,
      },
    });
  },
};
