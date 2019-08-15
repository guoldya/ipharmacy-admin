<template>
  <div>
    <a-select defaultValue="lucy" style="width: 120px"  mode="multiple">
      <div slot="dropdownRender" slot-scope="menu">
        <v-nodes :vnodes="menu"/>
        <a-divider style="margin: 4px 0;" />
        <div style="padding: 8px; cursor: pointer;">
          <a-icon type="plus" /> Add item
        </div>
      </div>
      <a-select-option value="jack">Jack</a-select-option>
      <a-select-option value="lucy">Lucy</a-select-option>
    </a-select>
    <treeSelect
      :search="searchTree"
      :onSelect="selectTree"
      :treeData="treeData"
      :vModel="data"
    >

    </treeSelect>

  </div>

</template>
<script>
  import treeSelect from './picCropper'
  export default {
   data(){
     return{
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
       data:['0-1-0-1', '0-1-0-2'],
     }
   },
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      },
      treeSelect
    },
    methods:{
      searchTree(value){
        console.log(value)
      },
      selectTree(value){
        console.log(value);
        // this.data=value;
        // this.testData =value;
      }
    }
  }
</script>