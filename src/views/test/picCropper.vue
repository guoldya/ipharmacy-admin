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
          checkable
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
      // search:{
      //   type:Function
      // },
      optionData:{
        type:Array
      },
      // treeData:{
      //   type:Array
      // },
      // onSelect:{
      //   type:Function
      // },
      searchSelect:{
        type:Function
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
        treeData: [{
          title: '0-0',
          key: '0-0',
          children: [{
            title: '0-0-0',
            key: '0-0-0',
            children: [
              { title: '0-0-0-0', key: '0-0-0-0' },
              { title: '0-0-0-1', key: '0-0-0-1' },
              { title: '0-0-0-2', key: '0-0-0-2' }
            ]
          }, {
            title: '0-0-1',
            key: '0-0-1',
            children: [
              { title: '0-0-1-0', key: '0-0-1-0' },
              { title: '0-0-1-1', key: '0-0-1-1' },
              { title: '0-0-1-2', key: '0-0-1-2' }
            ]
          }, {
            title: '0-0-2',
            key: '0-0-2'
          }]
        }, {
          title: '0-1',
          key: '0-1',
          children: [
            { text: '0-1-0-0', id: '0-1-0-0' },
            { text: '0-1-0-1', id: '0-1-0-1' },
            { text: '0-1-0-2', id: '0-1-0-2' }
          ]
        }, {
          title: '0-2',
          key: '0-2'
        }],
        expandedKeys: ['0-0-0', '0-0-1'],
        autoExpandParent: true,
        checkedKeys: ['0-0-0'],
        selectedKeys: [],
        testData: [
          { text: '0-1-0-0', id: '0-1-0-0' },
          { text: '0-1-0-1', id: '0-1-0-1' },
          { text: '0-1-0-2', id: '0-1-0-2' }
        ],
        loadkey: '0-1-0-0'
      }
    },
    methods: {
      search(){

      },
      onSelect(){

      }
    }
  }
</script>

