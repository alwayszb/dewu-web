<style lang="less">
@import './product-card.less';
</style>

<script>
const name = 'product-card';

export default {
  name,
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    this.name = name;

    return {};
  },
  render() {
    const { name: title, image, articleNumber, sellPrice, sellDate } = this.data;

    return (
      <div class={name}>
        <div class={`${name}-header`}>
          <a-row gutter={16}>
            <a-col span={8}>
              <div v-viewer={{ navbar: false, toolbar: false }}>
                <img class={`${name}-image`} v-lazy={image} alt={title} />
              </div>
            </a-col>
            <a-col span={16}>
              <a
                class={`${name}-header-title`}
                href={`https://m.poizon.com/router/product/ProductDetail?spuId=${this.data.spuId}`}
                target="_blank"
              >
                <span>{title}</span>
              </a>
            </a-col>
          </a-row>
        </div>
        <div class={`${name}-content`}>
          <div>
            <span>Article Number: </span>
            <span style={{ fontWeight: 500 }}>{articleNumber}</span>
          </div>
          <div>
            <span>Sell Price: </span>
            <span style={{ fontWeight: 500 }}>{sellPrice}</span>
          </div>
          <div>
            <span>Sell Date: </span>
            <span style={{ fontWeight: 500 }}>{sellDate}</span>
          </div>
        </div>
        <div class={`${name}-footer`}>
          <div class={`${name}-footer-main`}>{this.$slots.footer}</div>
          <div class={`${name}-footer-extra`}>{this.$slots.footerExtra}</div>
        </div>
      </div>
    );
  },
};
</script>
