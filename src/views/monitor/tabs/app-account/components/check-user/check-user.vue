<script>
import { object } from 'vue-types';
export default {
  props: {
    userInfo: object().isRequired,
  },
  render() {
    return (
      <a-descriptions title="User Info" layout="vertical" size="small">
        <a-descriptions-item label="Avatar">
          <img src={this.userInfo.icon} alt="" width="40" />
        </a-descriptions-item>
        <a-descriptions-item label="User Name">{this.userInfo.userName}</a-descriptions-item>
        <a-descriptions-item label="User Id">{this.userInfo.userId}</a-descriptions-item>
        <a-descriptions-item label="Mobile">{this.userInfo.mobile}</a-descriptions-item>
        <a-descriptions-item label="Account">{this.userInfo.account}</a-descriptions-item>
      </a-descriptions>
    );
  },
};
</script>
