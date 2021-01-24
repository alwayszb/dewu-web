<script>
import { Trends } from '@/components';

const name = 'trends-modal';

export default {
  name,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    product: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    this.name = name;

    return {
      visible: false,
      size: null,
    };
  },
  methods: {
    onClose() {
      this.$emit('input', false);
    },
    onSyncClick() {
      this.$emit('sync', this.product);
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.visible = val;
      },
    },
    visible(val) {
      if (!val && this.value) {
        this.onClose();
      }
    },
    // product: {
    //   immediate: true,
    //   handler(val) {
    //     this.size = val.productSizes ? val.productSizes[0].size : null;
    //   },
    // },
  },
  render() {
    return (
      <Modal v-model={this.visible} class={name} hasDivider>
        <div slot="header" class="text-ellipsis" v-width={800}>
          [ {this.product.articleNumber} ] {this.product.name}
        </div>
        <Button noBorder size="s" style={{ position: 'absolute' }} onClick={this.onSyncClick}>
          <v-icon name="spider" />
        </Button>
        {this.product.productSizes && (
          <SwitchList
            v-model={this.size}
            datas={this.product.productSizes.map(({ size }) => size)}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}
            small
          />
        )}
        <Trends articleNumber={this.product.articleNumber} size={this.size} />
        <div slot="footer">
          <Button onClick={this.onClose}>Close</Button>
        </div>
      </Modal>
    );
  },
};
</script>
