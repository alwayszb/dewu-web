<style lang="less" scoped>
// @import '';
</style>

<script>
import { lodash } from '@/utils';
const name = 'stock-summary';

export default {
  name,
  props: {
    stocks: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    totalStocks() {
      return this.stocks.length;
    },
    totalProfit() {
      return lodash.round(lodash.sumBy(this.stocks, 'profit'), 2);
    },
    totalFund() {
      return lodash.sumBy(this.stocks, 'stockPrice');
    },
    averageProfit() {
      return lodash.round(this.totalProfit / this.totalStocks, 2);
    },
    deficitCount() {
      return this.stocks.filter(({ profit }) => profit <= 0).length;
    },
  },
  render() {
    const tagStyles = { padding: '0.25rem 0.5rem' };
    const numberStyles = { fontWeight: 'bold' };
    return (
      <div class={name}>
        <a-tag color="blue" style={tagStyles}>
          <span>STOCKS COUNT: </span>
          <span style={numberStyles}>{this.totalStocks}</span>
        </a-tag>

        <a-tag color="orange" style={tagStyles}>
          <span>DEFICIT COUNT: </span>
          <span style={numberStyles}>{this.deficitCount}</span>
        </a-tag>

        <a-tag color="cyan" style={tagStyles}>
          <span>TOTAL FUND: </span>
          <span style={numberStyles}>{this.totalFund}</span>
        </a-tag>

        <a-tag color="red" style={tagStyles}>
          <span>PROFIT: </span>
          <span style={numberStyles}>
            {this.totalProfit} ┃ {this.averageProfit}(AVG)
          </span>
        </a-tag>
      </div>
    );
  },
};
</script>
