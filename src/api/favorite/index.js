import request from '@/request';

export default {
  findAllFavorites() {
    const url = '/favorites';
    return request.get(url);
  },
};
