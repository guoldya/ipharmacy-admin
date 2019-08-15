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


  </div>

</template>
<script>
  import treeSelect from
  export default {
    data: ()=>({console: console}),
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      }
    },
  }
</script>