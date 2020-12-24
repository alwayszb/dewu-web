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
                <img src={image} alt={title} />
              </div>
            </Cell>
            <Cell width={12}>
              <span class={`${name}-header-title`}>{title}</span>
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
          {!starred && (
            <v-icon name="regular/star" v-tooltip content="star" onClick={this.onStarClick} />
          )}
          {starred && (
            <v-icon name="star" v-tooltip content="cancel star" onClick={this.onCancelStarClick} />
          )}
          {hasTrends && (
            <v-icon name="chart-line" v-tooltip content="trends" onClick={this.onTrendsClick} />
          )}
        </div>
      </div>
    );
  },
};
</script>
