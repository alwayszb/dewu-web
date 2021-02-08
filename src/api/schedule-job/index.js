import request from '@/request';

export default {
  findAllScheduleJobs() {
    const url = '/schedule-jobs';
    return request.get(url);
  },
};
