<template>
  <div>
    <a-select
      :size="size"
      style="width: 300px"
      :allowClear="allowClear"
      :disabled="disabled"
      v-model="vModel"
      :filterOption="false"
      @search="search"
    >
      <div slot="dropdownRender" slot-scope="menu">
<!--        <v-nodes :vnodes="menu"/>-->
        <a-tree
          multiple
          :autoExpandParent="false"
          @select="onSelect"
          :selectedKeys="selectedKeys"
          :treeData="treeData"
        />
      </div>
      <a-select-option  v-for="(item,index) in testData" :value=item.id :title=item.text
                       :key="index">
        {{item.text}}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
  export default {
    props: {
      allowClear: {
        type: Boolean
      },
      disabled: {
        type: Boolean
      },
      size:{
        type:String
      },
      vModel:{
        type:Array
      },
      search:{
        type:Function
      },
      optionData:{
        type:Array
      },
      treeData:{
        type:Array
      },
      onSelect:{
        type:Function
      },
      searchSelect:{
        type:Function
      },
      testData:{
        type:Array
      }

    },
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      }
    },
    data() {
      return {
        expandedKeys: ['0-0-0', '0-0-1'],
        autoExpandParent: true,
        checkedKeys: ['0-0-0'],
        selectedKeys: [],
        // testData: [
        //   { text: '0-1-0-0', id: '0-1-0-0' },
        //   { text: '0-1-0-1', id: '0-1-0-1' },
        //   { text: '0-1-0-2', id: '0-1-0-2' }
        // ],
        loadkey: '0-1-0-0'
      }
    },
    methods: {
    }
  }
</script>

