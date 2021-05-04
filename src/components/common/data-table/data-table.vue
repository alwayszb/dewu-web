<script>
import { array, string, shape, func, bool } from 'vue-types';

const name = 'data-table';

export default {
  name,
  props: {
    rowKey: string().def('id'),
    api: shape({
      findAll: func().isRequired,
      create: func(),
      update: func(),
      delete: func(),
    }).loose.isRequired,
    normalize: func(),
    transform: func(),
    columns: array().isRequired,
    renderActions: shape({
      delete: bool(),
    }).def({
      delete: true,
    }),
    extraActions: func(),
  },
  data() {
    return {
      dataSource: [],
      filterOptions: {
        search: '',
      },
    };
  },
  computed: {
    combinedColumns() {
      return [...this.columns, this.actionColumn].filter((item) => !!item);
    },
    combinedActions() {
      const combinedActions = {
        ...this.renderActions,
      };
      return Object.keys(combinedActions).filter((key) => combinedActions[key] && this.api[key]);
    },
    actionColumn() {
      if (this.combinedActions.length > 0) {
        return {
          title: 'Actions',
          customRender: (value, record) => {
            return (
              <div>
                {this.getActionButtons(record)}
                {this.extraActions && this.extraActions(record)}
              </div>
            );
          },
        };
      }
      return null;
    },
  },
  created() {
    this.onLoadTable();
  },
  methods: {
    refresh() {
      this.onLoadTable();
    },
    onLoadTable() {
      this.api
        .findAll({
          ...this.filterOptions,
        })
        .then((res) => {
          this.dataSource = this.normalize ? this.normalize(res) : res.data;
        });
    },
    onSync() {
      this.filterOptions = {
        search: '',
      };
      this.onLoadTable();
    },
    onDelete(record) {
      this.api
        .delete(record[this.rowKey])
        .then(() => {
          this.$message.success('Delete success');
          this.onLoadTable();
        })
        .catch((error) => {
          this.$message.success(`Delete failed: ${error.message}`);
        });
    },
    getActionButtons(record) {
      const actionsButtons = {
        delete: (
          <a-popconfirm title="Confirm to delete?" onConfirm={() => this.onDelete(record)}>
            <a-button type="danger" size="small" icon="delete" v-tooltip="Delete" />
          </a-popconfirm>
        ),
      };
      return this.combinedActions.map((key) => actionsButtons[key]);
    },
  },
  render() {
    return (
      <du-table
        class={name}
        dataSource={this.dataSource}
        columns={this.combinedColumns}
        rowKey={this.rowKey}
      >
        <extra-layout slot="condition">
          <a-input-search
            v-model={this.filterOptions.search}
            placeholder="search"
            style={{ width: '16rem' }}
            onSearch={this.onLoadTable}
          />
          <a-button type="link" icon="sync" v-tooltip="Reset" onClick={this.onSync} />

          <template slot="extra">{this.$slots.extra}</template>
        </extra-layout>
      </du-table>
    );
  },
};
</script>
