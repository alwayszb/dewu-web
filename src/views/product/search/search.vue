<script>
import { commonMixin } from '@/mixins';
import { captureApi, productApi } from '@/api';
import { SearchInput, SearchHistory, SearchList } from './components';
import { isEmpty } from 'lodash';

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
    onSyncPurchaseRecords({ articleNumber }) {
      captureApi
        .capturePurchaseRecords({
          articleNumber,
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
    onCaptureDetail({ articleNumber }) {
      captureApi
        .captureDetail(articleNumber)
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
    onStar(product) {
      productApi.addProductFavorite(product.id).then(() => {
        product.favorite = true;
      });
    },
    onCancelStar(product) {
      productApi.removeProductFavorite(product.id).then(() => {
        product.favorite = false;
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
          onStar={this.onStar}
          onCancelStar={this.onCancelStar}
          onViewTrends={this.onViewTrends}
          onSync={this.onSyncPurchaseRecords}
          onCaptureDetail={this.onCaptureDetail}
        />
        {!isEmpty(this.selectedProduct) && (
          <trends-modal
            v-model={this.trendsModalVisible}
            articleNumber={this.selectedProduct.articleNumber}
            productName={this.selectedProduct.name}
          />
        )}
      </div>
    );
  },
};
</script>
