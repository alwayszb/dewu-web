<script>
import { object } from 'vue-types';

export default {
  props: {
    data: object().isRequired,
  },
  data() {
    this.rules = {
      userName: {
        required: true,
        message: 'UserName is required',
      },
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
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12, offset: 1 }}
        rules={this.rules}
        colon={false}
      >
        <a-form-model-item label="UserName" prop="userName" required>
          <a-input v-model={this.data.userName} />
        </a-form-model-item>
        <a-form-model-item label="Enable" prop="enable">
          <a-switch v-model={this.data.enable} />
        </a-form-model-item>
      </a-form-model>
    );
  },
};
</script>
