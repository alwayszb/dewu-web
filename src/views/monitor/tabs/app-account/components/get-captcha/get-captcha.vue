<script>
import { duNativeApi } from '@/api';
import { string } from 'vue-types';
export default {
  props: {
    value: string().def(''),
    mobile: string().isRequired,
  },

  data() {
    return {
      captcha: '',
      sending: false,
      timeCount: 0,
      interval: null,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.captcha = value;
      },
    },
  },

  methods: {
    onGetCaptchaClick() {
      this.sending = true;
      duNativeApi
        .sendCaptcha(this.mobile)
        .then(() => {
          this.$message.success('Captcha send success');
          this.timeCount = 90;
          this.interval = setInterval(() => {
            this.timeCount--;
            if (this.timeCount < 0) {
              this.clearInterval();
            }
          }, 1000);
        })
        .catch(() => {
          this.$message.error('Captcha send failed');
        })
        .finally(() => {
          this.sending = false;
        });
    },

    clearInterval() {
      clearInterval(this.interval);
      this.interval = null;
      this.sending = false;
      this.timeCount = 0;
    },

    onChange({ target }) {
      this.$emit('input', target.value);
    },
  },

  render() {
    return (
      <a-input v-model={this.captcha} placeholder="ENTER CAPTCHA" onChange={this.onChange}>
        <span slot="addonAfter">
          {this.timeCount > 0 ? (
            <a-button type="link" size="small" style={{ width: '3rem' }}>
              {this.timeCount}s
            </a-button>
          ) : (
            <a-button
              type="link"
              size="small"
              onClick={this.onGetCaptchaClick}
              loading={this.sending}
            >
              SEND
            </a-button>
          )}
        </span>
      </a-input>
    );
  },
};
</script>
