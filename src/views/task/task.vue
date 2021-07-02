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
      {
        title: 'Action',
        customRender: (value, record) => {
          return (
            record.enabled && (
              <a-button type="link" icon="play-circle" onClick={() => this.onExecuteNow(record)} />
            )
          );
        },
      },
    ];

    return {
      dataSource: [],
    };
  },
  created() {
    this.loadTableData();
  },
  methods: {
    loadTableData() {
      scheduleJobApi.findAllScheduleJobs().then(({ data }) => {
        this.dataSource = data;
      });
    },
    onExecuteNow(record) {
      scheduleJobApi.executeNow(record.id).then(() => {
        this.$message.success(`${record.name} started`);
        this.loadTableData();
      });
    },
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
