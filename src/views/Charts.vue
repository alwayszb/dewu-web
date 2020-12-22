<template>
  <div class="charts">
    <div :style="{ marginBottom: '1rem' }">
      <input v-model="search" placeholder="search..." />
      <button @click="onSearch">Search</button>
    </div>
    <template v-if="product">
      <div>
        <img :src="product.image" :alt="product.name" height="100px" width="auto" />
      </div>
      <div>{{ product.name }}</div>
      <div>发售价: {{ product.sellPrice }}</div>
      <div>发售日期: {{ product.sellDate }}</div>
      <ul :style="{ margin: 0, padding: 0 }">
        <li
          v-for="productSize in product.productSizes"
          :key="productSize.size"
          :style="{
            display: 'inline-block',
            padding: '0.25rem 0.5rem',
            fontWeight: productSize.size === size ? 'bold' : 'normal',
            cursor: 'pointer',
          }"
          @click="() => onSizeChange(productSize.size)"
        >
          {{ productSize.size }}
        </li>
      </ul>
      <div :style="{ marginBottom: '1rem' }">
        <div
          v-for="({ max, purchaseDate, price, orderSubTypeName }, index) in extremePrices"
          :key="index"
        >
          <span>{{ max ? '历史最高' : '历史最低' }} </span>
          <span>{{ purchaseDate }} </span>
          <span>{{ price }} </span>
          <span v-if="orderSubTypeName">{{ orderSubTypeName }}</span>
        </div>
      </div>
      <ve-line :data="chartData" :settings="chartSettings" height="500px" />
    </template>
  </div>
</template>

<script>
import axios from 'axios';
import lodash from 'lodash';

const request = axios.create({
  baseURL: 'http://localhost:4000',
});

export default {
  name: 'charts',
  components: {},
  created() {},
  mounted() {
    const { articleNumber } = this.$route.query;
    if (articleNumber) {
      this.search = articleNumber;
      this.getData(this.$route.query);
    }
  },
  beforeRouteUpdate({ query }, from, next) {
    this.getData(query);
    next();
  },
  data() {
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
      extremePrices: [],
      search: '',
      product: null,
      size: null,
    };
  },
  methods: {
    onSearch() {
      this.$router.push({
        name: 'charts',
        query: {
          articleNumber: this.search,
          size: this.size,
        },
      });
    },

    onSizeChange(size) {
      this.size = size;
      this.onSearch();
    },

    async getData(query) {
      const { articleNumber, size } = query;
      await request
        .get(`/products`, {
          params: {
            articleNumber,
          },
        })
        .then(({ data: product }) => {
          console.log(product);
          this.product = product;
        })
        .catch(() => {
          this.product = null;
        });

      if (this.product) {
        const { articleNumber, productSizes } = this.product;
        this.size = size || lodash.first(productSizes).size;
        this.loadPurchaseHistory(articleNumber);
      }
    },

    loadPurchaseHistory(articleNumber) {
      request
        .get(
          `/purchase-records/?page=0&limit=100000&articleNumber=${articleNumber}&size=${this.size}`,
        )
        .then(({ data }) => {
          const list = lodash.orderBy(
            data.map(({ price, ...res }) => ({
              price: price / 100,
              ...res,
            })),
            ['purchaseDate', 'price'],
          );
          const listMap = lodash.groupBy(list, 'purchaseDate');
          console.log(listMap);
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
  computed: {},
  watch: {},
};
</script>
