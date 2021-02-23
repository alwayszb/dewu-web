<script>
const name = 'auth';

export default {
  name,
  data() {
    return {
      password: null,
      logging: false,
    };
  },
  methods: {
    onLogIn() {
      if (!this.password) {
        this.$message.error('PASSWORD REQUIRED');
        this.$refs.password.focus();
        return;
      }

      if (this.password !== '68124825') {
        this.$message.error('INCORRECT PASSWORD');
        this.password = null;
        this.$refs.password.focus();
        return;
      }

      this.logging = true;
      localStorage.setItem('timestamp', new Date().getTime());
      location.href = '/';
    },
  },
  render() {
    return (
      <a-row type="flex" align="middle" justify="center">
        <a-col span={6}>
          <a-row type="flex">
            <a-col span={24}>
              <a-input
                ref="password"
                v-model={this.password}
                type="password"
                disabled={this.logging}
                placeholder="Password"
                onPressEnter={this.onLogIn}
              />
            </a-col>
            <a-col span={24}>
              <a-button
                type="primary"
                style={{ marginTop: '1rem', width: '100%' }}
                loading={this.logging}
                disabled={this.logging}
                onClick={this.onLogIn}
              >
                LOG IN
              </a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    );
  },
};
</script>
