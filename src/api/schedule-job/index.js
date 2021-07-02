import request from '@/request';

export default {
  findAllScheduleJobs() {
    const url = '/schedule-jobs';
    return request.get(url);
  },
  executeNow(id) {
    const url = `/schedule-jobs/${id}/execute`;
    return request.post(url);
  },
};
