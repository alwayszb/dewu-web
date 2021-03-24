<script>
import { lodash } from '@/utils';
import { purchaseRecordApi } from '@/api';
import { labelFormatter, normalize } from './trends';

const name = 'trends';

export default {
  name,
  props: {
    articleNumber: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: null,
    },
  },
  data() {
    this.extend = {
      series: {
        label: {
          show: true,
          formatter: (params) => labelFormatter(params, this),
        },
      },
    };
    return {
      loading: false,
      dataEmpty: true,
      chartData: {
        columns: ['purchaseDate', 'min', 'max'],
        rows: [],
      },
      chartSettings: {
        labelMap: {
          min: '最低成交价格',
          max: '最高成交价格',
        },
        min: [],
        max: [],
      },
      latestPriceItem: null,
      historyMaxPriceItem: null,
      historyMinPriceItem: null,
    };
  },
  watch: {
    articleNumber: {
      immediate: true,
      handler() {
        this.loadPurchaseHistory();
      },
    },
    size() {
      this.loadPurchaseHistory();
    },
  },
  methods: {
    loadPurchaseHistory() {
      if (!this.size || !this.articleNumber) {
        return;
      }
      this.loading = true;
      this.dataEmpty = true;
      this.chartData.rows = [];
      purchaseRecordApi
        .findPurchaseRecordsByProduct({ articleNumber: this.articleNumber, size: this.size })
        .then(({ data }) => {
          if (data.length === 0) {
            this.$message.warning('No trends data');
            return;
          }

          this.chartData.rows = normalize(data);
          this.dataEmpty = false;

          const sortedItems = data.sort((a, b) => a.price - b.price);
          const maxItem = lodash.last(sortedItems);
          const minItem = lodash.first(sortedItems);
          const maxPrice = maxItem.price / 100;
          const minPrice = minItem.price / 100;

          this.latestPriceItem = lodash.last(this.chartData.rows);
          this.historyMaxPriceItem = { ...maxItem, price: maxPrice };
          this.historyMinPriceItem = { ...minItem, price: minPrice };

          this.chartSettings.max = [
            maxPrice - (maxPrice % 100) + (maxPrice % 100 === 99 ? 200 : 100),
          ];
          this.chartSettings.min = [minPrice - (minPrice % 100) - (minPrice % 100 === 9 ? 100 : 0)];
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  render() {
    return (
      <div class={name}>
        {!this.loading && this.chartData.rows.length !== 0 && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            {this.historyMaxPriceItem && (
              <a-tag color="blue">
                <span>历史最高: </span>
                <span style={{ fontWeight: 600, fontSize: '1rem', textDecoration: 'underline' }}>
                  {this.historyMaxPriceItem.price}
                </span>
                <span style={{ marginLeft: '0.125rem' }}>
                  (
                  {`${this.historyMaxPriceItem.purchaseDate} ${this.historyMaxPriceItem.orderSubTypeName}`}
                  )
                </span>
              </a-tag>
            )}
            {this.historyMinPriceItem && (
              <a-tag color="green">
                <span>历史最低: </span>
                <span style={{ fontWeight: 600, fontSize: '1rem', textDecoration: 'underline' }}>
                  {this.historyMinPriceItem.price}
                </span>
                <span> ({this.historyMinPriceItem.purchaseDate})</span>
              </a-tag>
            )}
            {this.latestPriceItem && (
              <a-tag>
                <span>最新低价: </span>
                <span style={{ fontWeight: 600, fontSize: '1rem', textDecoration: 'underline' }}>
                  {this.latestPriceItem.min}
                </span>
                <span style={{ marginLeft: '0.125rem' }}>
                  ({`${this.latestPriceItem.purchaseDate} ${this.latestPriceItem.orderSubTypeName}`}
                  )
                </span>
              </a-tag>
            )}
          </div>
        )}
        <ve-line
          data={this.chartData}
          settings={this.chartSettings}
          extend={this.extend}
          loading={this.loading}
          dataEmpty={this.dataEmpty}
          height="500px"
        />
      </div>
    );
  },
};
</script>
