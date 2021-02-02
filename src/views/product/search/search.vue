<script>
import { commonMixin } from '@/mixins';
import { productApi, purchaseRecordApi } from '@/api';
import { SearchInput, SearchHistory, SearchList, TrendsModal } from './components';

const name = 'search';

export default {
  name,
  mixins: [commonMixin],
  beforeRouteUpdate({ query }, from, next) {
    const { value } = query;
    if (value && value.trim()) {
      this.onSearch({ value });
    }
    next();
  },
  mounted() {
    const { value } = this.$route.query;
    if (value && value.trim()) {
      this.onSearch({ value });
    }
  },
  data() {
    this.name = name;

    return {
      search: {
        value: '',
        type: 'articleNumber',
      },
      searchHistory: [],
      searchList: [],
      selectedProduct: {},
      trendsModalVisible: false,
    };
  },
  created() {
    const storedSearchHistory = localStorage.getItem('searchHistory');
    this.searchHistory = storedSearchHistory ? JSON.parse(storedSearchHistory) : [];
  },
  methods: {
    setHistory(search) {
      const { value, type } = search;
      const foundIndex = this.searchHistory.findIndex((item) => item.value === value);
      if (foundIndex >= 0) {
        this.searchHistory.splice(foundIndex, 1);
      }
      this.searchHistory.unshift({ value, type });

      if (this.searchHistory.length > 10) {
        // set max length: 10
        this.searchHistory.splice(10);
      }

      this.persistHistory();
    },
    onSearch(search) {
      this.setHistory(search);
      this.search = { ...search };
      this.invokeSearchApi(this.search);
    },
    onSearchClick(search) {
      if (!search.value.trim()) {
        return;
      }
      this.$router.push({
        name: 'search',
        query: search,
      });
    },
    invokeSearchApi(search) {
      productApi.findProductsByQuery({ query: search.value }).then(({ data }) => {
        this.searchList = data;
      });
    },
    persistHistory() {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    },
    onViewTrends(product) {
      this.selectedProduct = product;
      this.trendsModalVisible = true;
    },
    onSyncPurchaseRecords({ spuId }) {
      purchaseRecordApi
        .capturePurchaseRecords({
          spuId,
          captureAll: false,
        })
        .then(() => {
          this.$Message({
            type: 'success',
            text: 'Sync job started',
          });
        })
        .catch(() => {
          this.$Message({
            type: 'error',
            text: 'Call sync job failed',
          });
        });
    },
    onCaptureDetail({ spuId }) {
      purchaseRecordApi
        .captureDetail(spuId)
        .then(() => {
          this.$Message({
            type: 'success',
            text: 'Capture detail started',
          });
        })
        .catch(() => {
          this.$Message({
            type: 'error',
            text: 'Call capture detail failed',
          });
        });
    },
  },
  render() {
    return (
      <div class={name}>
        <SearchInput data={this.search} onSearch={this.onSearchClick} />
        <SearchHistory
          data={this.searchHistory}
          onSearch={this.onSearchClick}
          onClose={this.persistHistory}
          onClearAll={this.persistHistory}
        />
        <SearchList
          data={this.searchList}
          onViewTrends={this.onViewTrends}
          onSync={this.onSyncPurchaseRecords}
          onCaptureDetail={this.onCaptureDetail}
        />
        <TrendsModal
          v-model={this.trendsModalVisible}
          product={this.selectedProduct}
          onSync={this.onSyncPurchaseRecords}
        />
      </div>
    );
  },
};
</script>
