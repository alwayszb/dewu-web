<script>
import { appAccountApi, nikeNativeApi } from '@/api';
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

    onRefreshTokenClick({ id }) {
      nikeNativeApi
        .refreshToken(id)
        .then((res) => {
          this.refreshTable();
          this.$success({
            title: 'Refresh token success',
            width: 600,
            content: (
              <pre v-highlightjs>
                <code class="javascript">{JSON.stringify(res.data, null, 4)}</code>
              </pre>
            ),
          });
        })
        .catch((error) => {
          const highlightDirectives = [
            {
              name: 'highlightjs',
              value: error,
            },
          ];
          this.$error({
            title: 'Refresh token failed',
            width: 600,
            content: (
              <pre {...{ directives: highlightDirectives }}>
                <code class="javascript">{JSON.stringify(error, null, 4)}</code>
              </pre>
            ),
          });
        });
    },

    onCheckUserClick({ id }) {
      nikeNativeApi
        .getUserInfo(id)
        .then((res) => {
          this.$success({
            title: 'Get user info success',
            width: 600,
            content: (
              <pre v-highlightjs>
                <code class="javascript">{JSON.stringify(res.data, null, 4)}</code>
              </pre>
            ),
          });
        })
        .catch((error) => {
          this.$error({
            title: 'Refresh token failed',
            width: 600,
            content: (
              <pre v-highlightjs>
                <code class="javascript">{JSON.stringify(error, null, 4)}</code>
              </pre>
            ),
          });
        });
    },

    getExtraActions(record) {
      return [
        <a-button
          type="primary"
          size="small"
          icon="cloud-sync"
          v-tooltip="Refresh Token"
          onClick={() => this.onRefreshTokenClick(record)}
        />,
        record.accessToken && (
          <a-button
            size="small"
            icon="file-search"
            v-tooltip="User Info"
            onClick={() => this.onCheckUserClick(record)}
          />
        ),
      ];
    },
  },
  render() {
    return (
      <div class={name}>
        <data-table
          ref="table"
          api={api}
          columns={this.columns}
          extraActions={this.getExtraActions}
        >
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
