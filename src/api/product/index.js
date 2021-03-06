import request from '@/request';

export default {
  findProductsByQuery({ query, page = 0, limit = 100 }, { contentLoading = true } = {}) {
    const url = '/products';
    return request.get(url, {
      params: {
        query,
        page,
        limit,
      },
      contentLoading,
    });
  },
  findFavoriteProducts() {
    const url = '/products/favorite';
    return request.get(url);
  },
  findNewAddedProducts() {
    const url = '/products/new-added';
    return request.get(url);
  },
  addProductFavorite(id) {
    const url = `/products/${id}/favorite`;
    return request.patch(url);
  },
  removeProductFavorite(id) {
    const url = `/products/${id}/favorite`;
    return request.delete(url);
  },
  findProductsReleaseRecently() {
    const url = '/products/release-recently';
    return request.get(url);
  },
};
