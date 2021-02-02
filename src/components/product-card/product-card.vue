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
    onStarClick() {
      this.$emit('star', this.data);
    },
    onCancelStarClick() {
      this.$emit('cancelStar', this.data);
    },
    onTrendsClick() {
      this.$emit('viewTrends', this.data);
    },
    onImagePreview(url) {
      this.$ImagePreview(url);
    },
    OnSyncClick() {
      this.$emit('sync', this.data);
    },
    onCaptureDetailClick() {
      this.$emit('captureDetail', this.data);
    },
  },
  render() {
    const {
      name: title,
      image,
      articleNumber,
      sellPrice,
      sellDate,
      starred,
      productSizes,
    } = this.data;

    const hasTrends = productSizes && productSizes.length > 0;

    return (
      <div class={name}>
        <div class={`${name}-header`}>
          <Row space={10}>
            <Cell width={12}>
              <div class="flex-center">
                <img
                  class={`${name}-image`}
                  src={image}
                  alt={title}
                  onClick={() => this.onImagePreview(image)}
                />
              </div>
            </Cell>
            <Cell width={12}>
              <a
                class={`${name}-header-title`}
                href={`https://m.poizon.com/router/product/ProductDetail?spuId=${this.data.spuId}`}
                target="_blank"
              >
                {title}
              </a>
            </Cell>
          </Row>
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
          {this.$slots.footer ? (
            this.$slots.footer
          ) : (
            <div>
              {!starred && (
                <v-icon name="regular/star" v-tooltip content="star" onClick={this.onStarClick} />
              )}
              {starred && (
                <v-icon
                  name="star"
                  v-tooltip
                  content="cancel star"
                  onClick={this.onCancelStarClick}
                />
              )}
              <v-icon
                name="camera"
                v-tooltip
                content="capture detail"
                onClick={this.onCaptureDetailClick}
              />
              {hasTrends && (
                <v-icon name="chart-line" v-tooltip content="trends" onClick={this.onTrendsClick} />
              )}
              <Poptip content="Be sure to sync?" onConfirm={this.OnSyncClick}>
                <v-icon name="spider" />
              </Poptip>
            </div>
          )}
        </div>
      </div>
    );
  },
};
</script>
