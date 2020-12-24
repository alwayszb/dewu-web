<script>
const name = 'home';

export default {
  name,
  data() {
    this.name = name;

    return {};
  },
  render() {
    return <div class={name}>Home</div>;
  },
};
</script>
