<template>
    <div>
      <a-input :type="boxInitialized.inValueType" v-if="selectNode.lo==1 && selectNode.colDbType !=2"
               @change="inputChange" size="small" v-model="selectNode.assertVal"></a-input>
      <div v-else-if="selectNode.lo==2 && selectNode.colDbType !=2">
        <a-input :type="boxInitialized.inValueType" class="inputLeft" size="small" placeholder="最小值"
                 @change="scopeAssertVal" v-model="selectNode.assertVal"/>
        <a-input class="inputCenter" size="small" placeholder="~" disabled/>
        <a-input :type="boxInitialized.inValueType" class="inputRight" size="small" placeholder="最大值"
                 @change="scopeAssertVal1" v-model="selectNode.assertVal1"/>
      </div>
      <div v-else-if="boxInitialized.inputType =='select' && selectNode.lo==3">
        <a-select
          size="small"
          v-model="selectNode.assertValList"
          showSearch
          mode="multiple"
          @search="searchSelect"
          @change="assertValSelect"
          :defaultActiveFirstOption="false"
          :showArrow="false"
          :filterOption="false"
          :maxTagCount="10"
          :open="nodeSelectOpen"
          @dropdownVisibleChange="nodeVisibleChange"
        >
          <span slot="maxTagPlaceholder" @click="nodeTagPlaceholder">查看更多</span>
          <a-select-option v-for="(op,index) in boxInitialized.inputSelectData" :value="op.ID" :title="op.NAME"
                           :key="index">{{op.NAME}}
          </a-select-option>
        </a-select>
      </div>
      <div v-else-if="boxInitialized.inputType =='treeSelect' && selectNode.lo==3">
        <treeSelect
          :size="'small'"
          style="maxHeight:300px;z-index: 100"
          :vModel="selectNode.assertValList"
          :optionData="boxInitialized.viewSelect"
          :treeData="boxInitialized.inputSelectData"
          :selectChange="nodeSelectChange"
          :treeSelect="nodeTreeSelected"
          :loadData="nodeLoadData"
          :selectedKeys="selectNode.assertValList"
          :selectSearch="nodeSelectSearch"
          :treeMoreTag="treeMoreNode"
        ></treeSelect>
      </div>
      <a-date-picker v-else-if="selectNode.lo==1 && selectNode.colDbType ==2"
                     :defaultValue=" selectNode.assertVal? moment(selectNode.assertVal,'YYYY-MM-DD') : null"
                     @change="nodeDatePick"
                     size="small"></a-date-picker>
      <a-range-picker v-else-if="selectNode.lo==2 && selectNode.colDbType ==2"
                      :defaultValue="selectNode.assertVal? [moment(selectNode.assertVal,  'YYYY-MM-DD'), moment(selectNode.assertVal1,  'YYYY-MM-DD')]:null"
                      @change="nodeRangePick" size="small"></a-range-picker>
      <div v-else>
        <a-input size="small"></a-input>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'conditionModule'
  }
</script>

<style scoped>

</style>