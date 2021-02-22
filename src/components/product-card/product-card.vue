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
  methods: {
    onImagePreview(url) {
      this.$ImagePreview(url);
    },
  },
  render() {
    const { name: title, image, articleNumber, sellPrice, sellDate } = this.data;

    return (
      <div class={name}>
        <div class={`${name}-header`}>
          <a-row gutter={8}>
            <a-col span={8}>
              <div class="flex-center">
                <img
                  class={`${name}-image`}
                  src={image}
                  alt={title}
                  onClick={() => this.onImagePreview(image)}
                />
              </div>
            </a-col>
            <a-col span={16}>
              <a
                class={`${name}-header-title`}
                href={`https://m.poizon.com/router/product/ProductDetail?spuId=${this.data.spuId}`}
                target="_blank"
              >
                {title}
              </a>
            </a-col>
          </a-row>
        </div>
        <div class={`${name}-content`}>
          <div class="text-ellipsis">
            <span class="primary-color">Article Number: </span>
            <span style={{ fontWeight: 500 }}>{articleNumber}</span>
          </div>
          <div>
            <span class="primary-color">Sell Price: </span>
            <span style={{ fontWeight: 500 }}>{sellPrice}</span>
          </div>
          <div>
            <span class="primary-color">Sell Date: </span>
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
