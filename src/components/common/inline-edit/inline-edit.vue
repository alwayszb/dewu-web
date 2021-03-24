<style lang="less" scoped>
@import './inline-edit.less';
</style>

<template>
  <div :class="classes">
    <div :class="`${name}-content`">
      <slot name="prefix" />
      <div :class="`${name}-input`" @click="onClick">
        <!-- inputs -->
        <template v-if="editing">
          <a-input
            v-if="type === 'input'"
            ref="input"
            :size="size"
            :value="value"
            @blur="onBlur"
            @change="onInputChange"
            @pressEnter="onEnter"
          />
          <a-textarea
            v-if="type === 'textarea'"
            ref="input"
            :value="value"
            :auto-size="autoSize"
            @blur="onBlur"
            @change="onInputChange"
          />
        </template>
        <template v-if="!editing">
          <!-- text -->
          <span v-if="value" :class="`${name}-text`" :style="textStyles">{{ value }}</span>
          <!-- placeholder -->
          <span v-else :class="`${name}-placeholder`">{{ placeholder }}</span>
        </template>
      </div>
      <slot name="suffix" />
    </div>
  </div>
</template>

<script>
const name = 'inline-edit';

export default {
  name,
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    placeholder: {
      type: String,
      default: '点击输入',
    },
    size: {
      type: String,
      default: 'default',
    },
    type: {
      type: String,
      default: 'input',
      validator(value) {
        return ['input', 'textarea'].includes(value);
      },
    },
    /**
     * 自适应内容高度，可设置为 true|false 或对象：{ minRows: 2, maxRows: 6 }, 仅在 type='textarea' 时生效
     */
    autoSize: {
      type: [Boolean, Object],
      default: true,
    },
    /**
     * 非输入状态下文本的样式
     */
    textStyles: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      name,
      editing: false,
    };
  },
  computed: {
    classes() {
      return [name, `${name}--${this.type}`, this.size && `${name}--${this.size}`];
    },
  },
  methods: {
    onClick() {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    onInputChange(e) {
      const { value } = e.target;
      /**
       * 输入变化时触发
       */
      this.$emit('change', value);
    },
    onBlur(e) {
      this.editing = false;
      /**
       * 失去焦点时触发
       */
      this.$emit('blur', e.target.value);
    },
    onEnter(e) {
      this.editing = false;

      this.$emit('pressEnter', e.target.value);
    },
  },
};
</script>
