<template>
  <div>
    <el-tiptap v-model="content" :extensions="extensions" />
  </div>
</template>

<script>
import {
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  FormatClear,
  TextColor,
  TextHighlight,
  CodeBlock,
} from "element-tiptap";

export default {
  props: {
    value: String,
  },
  model: {
    prop: "value",
    event: "change",
  },
  computed: {
    content: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val); //这里多用于子组件间没有input元素中,通过在computed属性中监听值变化事emit input事件
      },
    },
  },
  data() {
    // 编辑器的 extensions
    // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
    return {
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new FormatClear(),
        new TextColor(),
        new TextHighlight(),
        new CodeBlock(),
      ],
    };
  },
};
</script>
