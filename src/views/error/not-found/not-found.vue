<script>
const name = 'not-found';

export default {
  name,
  data() {
    this.name = name;

    return {};
  },
  render() {
    return <div class={name}>Not Found</div>;
  },
};
</script>
