<script>
import { productApi } from '@/api';
import { time } from '@/utils';
import { lodash } from '@/utils';

const name = 'home';

export default {
  name,
  data() {
    this.name = name;

    return {
      productList: [],
      actionRecord: {},
      trendsModalVisible: false,
    };
  },
  created() {
    this.loadNewAddedProductList();
  },
  methods: {
    async loadNewAddedProductList() {
      this.productList = await productApi.findNewAddedProducts().then(({ data }) => data);
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
    onViewTrends(product) {
      this.actionRecord = product;
      this.trendsModalVisible = true;
    },
  },
  render() {
    return (
      <div class={name}>
        <div style={{ padding: '0.75rem 0.5rem' }}>
          <a-row gutter={8}>
            {this.productList.map((product) => (
              <a-col span={6} key={product.id}>
                <product-card data={product} style={{ marginBottom: '0.5rem' }}>
                  <div slot="footer">{time.formatToTime(product.createdAt)}</div>
                  <div slot="footerExtra">
                    {!product.favorite && (
                      <icon-button
                        icon="star"
                        tooltip="Star"
                        onClick={() => this.onStar(product)}
                      />
                    )}
                    {product.favorite && (
                      <icon-button
                        icon="star"
                        tooltip="Cancel Star"
                        filled
                        onClick={() => this.onCancelStar(product)}
                      />
                    )}
                    <icon-button
                      icon="stock"
                      tooltip="View Trends"
                      onClick={() => this.onViewTrends(product)}
                    />
                  </div>
                </product-card>
              </a-col>
            ))}
          </a-row>
        </div>

        {/** trends modal */}
        {!lodash.isEmpty(this.actionRecord) && (
          <trends-modal
            v-model={this.trendsModalVisible}
            articleNumber={this.actionRecord.articleNumber}
            productName={this.actionRecord.name}
          />
        )}
      </div>
    );
  },
};
</script>
