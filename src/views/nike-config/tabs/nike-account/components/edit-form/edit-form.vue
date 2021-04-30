<script>
import { object } from 'vue-types';

export default {
  props: {
    data: object().isRequired,
  },
  data() {
    this.rules = {
      userName: { required: true, message: 'UserName is required' },
      accessToken: { required: true, message: 'Access token is required' },
      refreshToken: { required: true, message: 'Refresh token is required' },
      'extra.visitorId': { required: true, message: 'Visit id is required' },
      'extra.upmId': { required: true, message: 'UPM id is required' },
      'extra.clientId': { required: true, message: 'Client id is required' },
    };

    return {};
  },
  computed: {
    formInstance() {
      return this.$refs.form;
    },
  },
  render() {
    return (
      <a-form-model
        ref="form"
        {...{ attrs: { model: this.data } }}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15, offset: 1 }}
        rules={this.rules}
        colon={false}
      >
        <a-form-model-item label="UserName" prop="userName" required>
          <a-input v-model={this.data.userName} />
        </a-form-model-item>
        <a-form-model-item label="Access Token" prop="accessToken" required>
          <a-textarea v-model={this.data.accessToken} />
        </a-form-model-item>
        <a-form-model-item label="Refresh Token" prop="refreshToken" required>
          <a-textarea v-model={this.data.refreshToken} />
        </a-form-model-item>
        <a-form-model-item label="Visitor Id" prop="extra.visitorId" required>
          <a-input v-model={this.data.extra.visitorId} />
        </a-form-model-item>
        <a-form-model-item label="UPM Id" prop="extra.upmId" required>
          <a-input v-model={this.data.extra.upmId} />
        </a-form-model-item>
        <a-form-model-item label="Client Id" prop="extra.clientId" required>
          <a-input v-model={this.data.extra.clientId} />
        </a-form-model-item>
        <a-form-model-item label="Enable" prop="enable">
          <a-switch v-model={this.data.enable} />
        </a-form-model-item>
      </a-form-model>
    );
  },
};
</script>
