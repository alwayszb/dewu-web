<script>
import lodash from 'lodash';
import { purchaseRecordApi } from '@/api';

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
    this.name = name;

    return {
      chartData: {
        columns: ['purchaseDate', 'max', 'min'],
        rows: [],
      },
      chartSettings: {
        labelMap: {
          min: '最低价格曲线',
          max: '最高价格曲线',
        },
        min: [],
        max: [],
      },
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
      purchaseRecordApi
        .findPurchaseRecordsByProduct({ articleNumber: this.articleNumber, size: this.size })
        .then(({ data }) => {
          if (data.length === 0) {
            this.$Message({
              type: 'warn',
              text: 'No trends data',
            });
            return;
          }

          const list = lodash.orderBy(
            data.map(({ price, ...res }) => ({
              price: price / 100,
              ...res,
            })),
            ['purchaseDate', 'price'],
          );
          const listMap = lodash.groupBy(list, 'purchaseDate');
          this.chartData.rows = lodash.flatMap(Object.values(listMap), (val) => {
            const minItem = lodash.first(val);
            const maxItem = lodash.last(val);
            return {
              min: minItem.price,
              max: maxItem.price,
              purchaseDate: minItem.purchaseDate,
            };
          });

          const sortedItems = data.sort((a, b) => a.price - b.price);
          const maxItem = lodash.last(sortedItems);
          const minItem = lodash.first(sortedItems);
          const maxPrice = maxItem.price / 100;
          const minPrice = minItem.price / 100;
          this.extremePrices = [
            { ...maxItem, max: true, price: maxPrice },
            { ...minItem, min: true, price: minPrice },
          ];
          this.chartSettings.max = [maxPrice - (maxPrice % 100) + 100];
          this.chartSettings.min = [minPrice - (minPrice % 100)];
        });
    },
  },
  render() {
    return (
      <div class={name}>
        <ve-line data={this.chartData} settings={this.chartSettings} height="500px" />
      </div>
    );
  },
};
</script>
