<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
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
    OnSyncClick() {
      this.$emit('sync', this.data);
    },
    onCaptureDetailClick() {
      this.$emit('captureDetail', this.data);
    },
  },
  render() {
    const { favorite } = this.data;

    return (
      <product-card data={this.data}>
        <div slot="footerExtra">
          {!favorite && <icon-button icon="star" tooltip="Star" onClick={this.onStarClick} />}
          {favorite && (
            <icon-button
              icon="star"
              tooltip="Cancel Star"
              filled
              onClick={this.onCancelStarClick}
            />
          )}
          <icon-button icon="file-sync" tooltip="Sync Detail" onClick={this.onCaptureDetailClick} />
          <icon-button icon="stock" tooltip="View Trends" onClick={this.onTrendsClick} />
          <a-popconfirm title="Be sure to sync purchase records?" onConfirm={this.OnSyncClick}>
            <icon-button icon="sync" />
          </a-popconfirm>
        </div>
      </product-card>
    );
  },
};
</script>
