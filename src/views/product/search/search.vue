<script>
import { commonMixin } from '@/mixins';
import { productApi } from '@/api';
import { SearchInput, SearchHistory, SearchList } from './components';

const name = 'search';

export default {
  name,
  mixins: [commonMixin],
  components: {
    SearchInput,
    SearchHistory,
  },
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

      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
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
      productApi.findProductsByQuery(search.value).then(({ data }) => {
        this.searchList = data;
      });
    },
    onHistoryClose() {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    },
    onHistoryClearAll() {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    },
  },
  render() {
    return (
      <div class={name}>
        <SearchInput data={this.search} onSearch={this.onSearchClick} />
        <SearchHistory
          data={this.searchHistory}
          onSearch={this.onSearchClick}
          onClose={this.onHistoryClose}
          onClearAll={this.onHistoryClearAll}
        />
        <SearchList data={this.searchList} />
      </div>
    );
  },
};
</script>
