<template>
  <div>
    <test21
      :vModel="vModel"
      :treeData="treeData"
      :selectChange="selectChange"
      :treeSelect="treeSelect"
      :loadData="loadData"
      :selectedKeys="selectedKeys"
    >
    </test21>
  </div>

</template>
<script>
  import treeSelect from './picCropper'
  import test21 from './test21'

  export default {
    data() {
      return {
        vModel:[],
        selectedKeys:[],
        treeData: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
          { title: '0-1-0-0', key: '0-1-0-0' },
          { title: '0-1-0-1', key: '0-1-0-1' },
          { title: '0-1-0-2', key: '0-1-0-2' }],
      }
    },
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      },
      treeSelect,
      test21
    },
    methods: {
      treeSelect(value,e){
        console.log(e)
        this.vModel = value;
        this.selectedKeys = value;
      },
      selectChange(value){
        console.log(value)
        this.vModel = value;
        this.selectedKeys = value;
      },
      loadData(){

      },
    }
  }
</script>