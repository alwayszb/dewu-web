<script>
import { time } from '@/utils';
import { scheduleJobApi } from '@/api';

const name = 'task';

const rowKey = 'id';

export default {
  name,
  data() {
    this.name = name;
    this.columns = [
      { dataIndex: 'name', title: 'Name' },
      { dataIndex: 'cronExpression', title: 'Cron Expression' },
      { dataIndex: 'type', title: 'Type' },
      { dataIndex: 'property', title: 'Property' },
      {
        dataIndex: 'lastExecutionAt',
        title: 'Last Execution',
        customRender: (value) => (value ? time.formatToTime(value) : '-'),
      },
      {
        dataIndex: 'nextExecutionAt',
        title: 'Next Execution',
        customRender: (value) => (value ? time.formatToTime(value) : '-'),
      },
      {
        dataIndex: 'enabled',
        title: 'Status',
        customRender: (value) => {
          return value ? <a-tag color="green">Enabled</a-tag> : <a-tag>Disabled</a-tag>;
        },
      },
    ];

    return {
      dataSource: [],
    };
  },
  created() {
    scheduleJobApi.findAllScheduleJobs().then(({ data }) => {
      this.dataSource = data;
    });
  },
  render() {
    return (
      <div class={name}>
        <a-table
          dataSource={this.dataSource}
          columns={this.columns}
          rowKey={rowKey}
          pagination={false}
        ></a-table>
      </div>
    );
  },
};
</script>
