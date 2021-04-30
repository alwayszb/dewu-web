<script>
import { appAccountApi, duNativeApi } from '@/api';
import { time } from '@/utils';
import EditForm from './components/edit-form';
import GetCaptcha from './components/get-captcha';
import CheckUser from './components/check-user';

const name = 'app-account';
const api = {
  ...appAccountApi,
  findAll: (options) => {
    return appAccountApi.findAll({ ...options, platform: 'dewu' });
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
        width: 220,
        customRender: (value, record) => {
          return (
            <inline-edit
              v-model={record.accessToken}
              style={{ width: '20rem' }}
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
    this.extraActions = (value, record) => {
      return [
        <a-button
          type="primary"
          size="small"
          icon="cloud-sync"
          v-tooltip="Sync Token"
          onClick={() => {
            this.actionRecord = { ...record };
            this.captchaModalVisible = true;
          }}
        />,
        record.accessToken && (
          <a-button
            size="small"
            icon="file-search"
            v-tooltip="Check User"
            onClick={() => this.onCheckUserClick(record)}
          />
        ),
      ];
    };

    return {
      editModalVisible: false,
      actionRecord: null,
      confirmLoading: false,
      captchaModalVisible: false,
      checkUserModalVisible: false,
      checkedUserInfo: null,
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
      this.actionRecord = { platform: 'dewu' };
      this.editModalVisible = true;
    },

    onAddConfirm() {
      this.$refs.editForm.formInstance
        .validate()
        .then(() => {
          this.addRecord();
        })
        .catch(() => {});
    },

    onAddCancel() {
      this.$refs.editForm.formInstance.resetFields();
    },

    addRecord() {
      this.confirmLoading = true;
      appAccountApi
        .create(this.actionRecord)
        .then(() => {
          this.$message.success('Add success');
          this.editModalVisible = false;
          this.refreshTable();
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },

    onSyncTokenSubmit() {
      this.confirmLoading = true;
      const { id, captcha } = this.actionRecord;
      appAccountApi
        .syncToken(id, captcha)
        .then(() => {
          this.$message.success('Sync token success');
          this.captchaModalVisible = false;
          this.$refs.captcha.clearInterval();
          this.refreshTable();
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },

    onSyncTokenCancel() {
      this.$refs.captcha.clearInterval();
    },

    onCheckUserClick(record) {
      duNativeApi
        .checkUser(record.accessToken)
        .then(({ data }) => {
          this.checkedUserInfo = data.data.userInfo;
          this.checkUserModalVisible = true;
          this.$message.success('User accessToken is valid');
        })
        .catch(() => {
          this.$message.error('Check user failed');
        });
    },
  },
  render() {
    return (
      <div class={name}>
        <data-table ref="table" api={api} columns={this.columns} extraActions={this.extraActions}>
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

        {this.actionRecord && this.actionRecord.userName && (
          <a-modal
            v-model={this.captchaModalVisible}
            title="Sync Token"
            okText="Sync Token"
            okButtonProps={{ props: { disabled: !this.actionRecord.captcha } }}
            confirmLoading={this.confirmLoading}
            onOk={this.onSyncTokenSubmit}
            onCancel={this.onSyncTokenCancel}
          >
            <a-form-model labelCol={{ span: 4 }} wrapperCol={{ span: 16, offset: 1 }} colon={false}>
              <a-form-model-item label="CAPTCHA">
                <GetCaptcha
                  ref="captcha"
                  v-model={this.actionRecord.captcha}
                  mobile={this.actionRecord.userName}
                />
              </a-form-model-item>
            </a-form-model>
          </a-modal>
        )}

        {this.checkedUserInfo && (
          <a-modal v-model={this.checkUserModalVisible} title="Check User">
            <CheckUser userInfo={this.checkedUserInfo} />
          </a-modal>
        )}
      </div>
    );
  },
};
</script>
