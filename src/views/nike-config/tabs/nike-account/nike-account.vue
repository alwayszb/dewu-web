<script>
import { appAccountApi } from '@/api';
import { time } from '@/utils';
import EditForm from './components/edit-form';

const name = 'app-account';
const api = {
  ...appAccountApi,
  findAll: (options) => {
    return appAccountApi.findAll({ ...options, platform: 'nike' });
  },
};

export default {
  name,
  data() {
    this.columns = [
      { dataIndex: 'userName', title: 'UserName', width: 200 },
      {
        dataIndex: 'accessToken',
        title: 'Access Token',
        customRender: (value, record) => {
          return (
            <inline-edit
              v-model={record.accessToken}
              style={{ width: '10rem' }}
              onBlur={() => this.onUpdate(record)}
            />
          );
        },
      },
      {
        dataIndex: 'refreshToken',
        title: 'Refresh Token',
        customRender: (value, record) => {
          return (
            <inline-edit
              v-model={record.refreshToken}
              style={{ width: '10rem' }}
              onBlur={() => this.onUpdate(record)}
            />
          );
        },
      },
      {
        dataIndex: 'tokenAcquireAt',
        title: 'Acquire At',
        customRender: (value) => (value ? time.formatToTime(value) : '-'),
      },
      {
        dataIndex: 'description',
        title: 'Description',
        customRender: (value, record) => {
          return (
            <inline-edit
              v-model={record.description}
              style={{ width: '20rem' }}
              onBlur={() => this.onUpdate(record)}
            />
          );
        },
      },
      {
        dataIndex: 'enable',
        title: 'Enable',
        customRender: (value, record) => {
          return <a-switch v-model={record.enable} onChange={() => this.onUpdate(record)} />;
        },
      },
    ];

    return {
      editModalVisible: false,
      actionRecord: null,
      confirmLoading: false,
    };
  },
  methods: {
    refreshTable() {
      this.$refs.table.refresh();
    },

    onUpdate(record) {
      appAccountApi
        .update(record.id, record)
        .then(() => {
          this.$message.success('Update success');
        })
        .catch(() => {
          this.$message.error('Update failed');
        });
    },

    onAddClick() {
      this.actionRecord = {
        platform: 'nike',
        extra: { visitorId: '', upmId: '', clientId: '' },
      };
      this.editModalVisible = true;
    },

    onAddConfirm() {
      this.$refs.editForm.formInstance.validate().then(() => {
        this.addRecord();
      });
    },

    onAddCancel() {
      this.$refs.editForm.formInstance.resetFields();
    },

    addRecord() {
      this.confirmLoading = true;
      const { extra, ...res } = this.actionRecord;
      appAccountApi
        .create({ ...res, extra: JSON.stringify(extra) })
        .then(() => {
          this.$message.success('Add success');
          this.editModalVisible = false;
          this.refreshTable();
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
  },
  render() {
    return (
      <div class={name}>
        <data-table ref="table" api={api} columns={this.columns}>
          <a-button slot="extra" type="primary" icon="plus" onClick={this.onAddClick}>
            ADD RECORD
          </a-button>
        </data-table>

        {this.actionRecord && (
          <a-modal
            v-model={this.editModalVisible}
            title="ADD RECORD"
            okText="CONFIRM"
            cancelText="CLOSE"
            confirmLoading={this.confirmLoading}
            onOk={this.onAddConfirm}
            onCancel={this.onAddCancel}
          >
            <EditForm ref="editForm" data={this.actionRecord} />
          </a-modal>
        )}
      </div>
    );
  },
};
</script>
