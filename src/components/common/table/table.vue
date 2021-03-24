<style lang="less">
@import './table.less';
</style>

<script>
import resize from 'vue-resize-directive';
import { Table } from 'ant-design-vue';
import { lodash } from '@/utils';
import utils from './utils';

const name = 'du-table';

// eslint-disable-next-line no-unused-vars
const { scroll, size, rowSelection, ...tableProps } = Table.props;

export default {
  name,
  directives: {
    resize,
  },
  props: {
    ...tableProps,
    /**
     * 标题
     */
    title: {
      type: String,
      default: null,
    },
    /**
     * 是否全高度
     */
    fullHeight: {
      type: Boolean,
      default: false,
    },
    /**
     * 光标移动到行上时是否高亮
     */
    rowHoverHighlight: {
      type: Boolean,
      default: true,
    },
    /**
     * 标题自定义样式
     */
    titleStyles: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 搜索条件自定义样式
     */
    conditionStyles: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 主区域即表格的自定义样式
     */
    mainStyles: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 底部自定义样式
     */
    footerStyles: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 设置当所有列宽度超出表格宽度后, 是否开启横向滚动, 不开启则会自适应未设置宽度的列
     *
     * `✅ 当列较多时, 推荐开启`

     * `🔔 当存在固定列时, 默认开启滚动且无法通过 scrollX 属性修改`
     *
     */
    scrollX: {
      type: Boolean,
      default: true,
    },
    /**
     * 设置 Y 轴滚动高度, 优先级低于 `fullHeight` 属性
     */
    scrollY: {
      type: String,
      default: null,
    },
    /**
     * 开启行选择
     */
    selection: {
      type: Boolean,
      default: false,
    },
    /**
     * 行选择属性
     */
    rowSelection: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      name,
      scroll: { x: 'max-content', y: this.fullHeight ? false : this.scrollY },
    };
  },
  computed: {
    classes() {
      return [name, this.rowHoverHighlight && `${name}--hover-highlight`];
    },
    hasTitle() {
      return this.title || this.$slots.title;
    },
    hasFixedColumn() {
      return this.columns.find(({ fixed }) => fixed);
    },
    combinedRowSelection() {
      if (!this.selection) {
        return undefined;
      }
      return {
        ...this.rowSelection,
        onSelect: (record, selected, selectedRows) => {
          /**
           * 行选择变化的时候触发
           *
           * @property {{selected: Boolean, selectedRows: Array, changeRows: Array}}
           */
          this.$emit('select', {
            selected,
            selectedRows,
            changeRows: [record],
          });
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          this.$emit('select', { selected, selectedRows, changeRows });
        },
      };
    },
  },
  watch: {
    scrollX: {
      immediate: true,
      handler(value) {
        if (this.hasFixedColumn) {
          return;
        }
        this.scroll.x = value ? 'max-content' : false;
      },
    },
    fullHeight: {
      handler() {
        this.calcTableScrollHeight();
      },
    },
  },
  mounted() {
    this.calcTableScrollHeight = lodash.debounce(this.calcScrollHeight, 300);
    this.resizeDirectives = [
      {
        name: 'resize',
        value: this.calcTableScrollHeight,
        arg: 'debounce',
      },
    ];
    this.calcTableScrollHeight();
  },
  methods: {
    calcScrollHeight() {
      if (!this.fullHeight) {
        return;
      }

      const { container, header, footer } = this.$refs;

      const containerHeight = container.$el.offsetHeight;

      const headerHeight = header ? header.offsetHeight : 0;

      const footerHeight = footer ? footer.offsetHeight : 0;

      const antTableHeader = container.$el.querySelector('.ant-table-thead');
      const antTableHeaderHeight = antTableHeader ? antTableHeader.offsetHeight : 0;

      const antTablePagination = container.$el.querySelector('.ant-table-pagination');
      const antTablePaginationHeight = antTablePagination
        ? utils.getOuterHeight(antTablePagination)
        : 0;

      const antTableScrollHeight =
        containerHeight -
        headerHeight -
        footerHeight -
        antTableHeaderHeight -
        antTablePaginationHeight;

      const tableBody = container.$el.querySelector('.ant-table-body');
      tableBody.style.minHeight = this.dataSource.length > 0 ? `${antTableScrollHeight}px` : 'auto';
      this.scroll.y = antTableScrollHeight;
    },
    renderTable() {
      return (
        <a-table
          {...{ attrs: this.$props }}
          class={`${name}-main`}
          scroll={this.scroll}
          columns={this.columns}
          data-source={this.dataSource}
          row-key={this.rowKey}
          pagination={false}
          style={this.mainStyles}
          title={null}
          rowSelection={this.combinedRowSelection}
        ></a-table>
      );
    },
    renderTitle() {
      return (
        this.hasTitle && (
          <div class={`${name}-title`} style={this.titleStyles}>
            {/** @slot 标题插槽 */}
            {this.$slots.title || (
              <du-title>
                <span>{this.title}</span>
                <template slot="extra">
                  {/** @slot 标题右侧插槽 */}
                  {this.$slots.extra}
                </template>
              </du-title>
            )}
          </div>
        )
      );
    },
    renderCondition() {
      return (
        <div class={`${name}-condition`} style={this.conditionStyles}>
          {/** @slot 搜索条件插槽 */}
          {this.$slots.condition}
        </div>
      );
    },
    renderFixedHeader() {
      return (
        <div slot="fixed-header" ref="header" {...{ directives: this.resizeDirectives }}>
          {this.renderTitle()}
          {this.renderCondition()}
        </div>
      );
    },
    renderFooter() {
      return (
        <div
          class={`${name}-footer`}
          slot="fixed-footer"
          ref="footer"
          {...{ directives: this.resizeDirectives }}
          style={this.footerStyles}
        >
          {/** @slot 底部插槽 */}
          {this.$slots.footer}
        </div>
      );
    },
  },
  render() {
    if (!this.fullHeight) {
      return (
        <div class={this.classes}>
          {this.renderTitle()}

          {this.renderCondition()}

          {this.renderTable()}
        </div>
      );
    }

    return (
      <full-height-container ref="table" class={this.classes}>
        <full-height-item
          ref="container"
          {...{ directives: this.resizeDirectives }}
          style={{ overflow: this.fullHeight ? 'hidden' : 'auto' }}
        >
          {this.renderFixedHeader()}

          {this.renderTable()}

          {this.renderFooter()}
        </full-height-item>
      </full-height-container>
    );
  },
};
</script>
