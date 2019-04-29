<template>
  <div>
    <a-select class="select" defaultValue="lucy" style="width: 120px" >
      <a-select-option value="jack">Jack</a-select-option>
      <a-select-option value="lucy">Lucy</a-select-option>
      <a-select-option value="disabled" disabled>Disabled</a-select-option>
      <a-select-option value="Yiminghe">yiminghe</a-select-option>
    </a-select>
    <a-dropdown>
      <a class="ant-dropdown-link" href="#">
        Hover me, Click menu item <a-icon type="down" />
      </a>
      <a-menu slot="overlay" @click="onClick">
        <a-menu-item key="1">1st menu item</a-menu-item>
        <a-menu-item key="2">2nd menu item</a-menu-item>
        <a-menu-item key="3">3rd menu item</a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-input  v-model="text"  style="width: 200px;"
              placeholder="日志内容"></a-input>
    <a-button type="primary" @click="handleAdd">记录</a-button>
    <a-button type="primary" @click="handleNewError">触发一个错误</a-button>
    <i class="iconfont icon anticonchufang"></i>
  </div>

</template>

<script>
  import { Icon } from 'ant-design-vue';
  const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1075515_yfbx0smkglf.js',
  })
  export default {
    name: 'Test',
    components: {
      IconFont,
    },
    data () {
      return {
        text: '测试BUG信息'
      }
    },
    methods: {
      onClick({ key }) {
        console.log(`Click on item ${key}`);
      },
      handleAdd()
      {
        this.$logAdd(this.text)
      },
      handleNewError()
      {
        console.log(a)
      }
    }
  }
</script>

<style>
  .select > .ant-select-selection{
    background-color: grey;
  }
</style>