<template>
  <div>
    <div v-for="(cd,index) in conditions" class="condition margin-top-10">
      <a-row>
        <a-col :span="7"></a-col>
        <a-col :span="4">
          <a-tree-select
            showSearch
            treeNodeFilterProp="title"
            class="width-100 treeStyle"
            v-model="cd.columnId"
            :treeData="treeData"
            @change="baseSelectTree(index,cd)"
          >
          </a-tree-select>
        </a-col>
        <a-col :span="2">
          <a-select class="width-100 margin-left-5" v-model="cd.relation">
            <a-select-option
              v-for="item in cd.operators"
              :value='item.id'
              :key="index"
            >
              {{item.text}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <!--文本输入框-->
          <div v-if="cd.inputType=='input'">
            <a-input  class="width-100 marLeft10" v-model="cd.assertVal"></a-input>
          </div>

          <!--下拉框-->
          <a-select
            mode='multiple'
            @search="searchSelect($event,cd.treeData,cd.columnId,cd)"
            v-else-if="cd.inputType=='select'"
            class="width-100 marLeft10"
            v-model="cd.values"
            :filterOption="false"
            :key="cd.key"
          >
            <a-select-option
              v-for="item in cd.treeData"
              :value='item.ID'
              :key="item.ID"
            >
              {{item.TITLE}}
            </a-select-option>
          </a-select>
          <!--树-->
          <a-tree-select
            multiple
            @search="searchTreeSelect($event,cd.treeData,cd.columnId,cd)"
            :treeData="cd.treeData"
            v-else-if="cd.inputType=='tree'"
            class="width-100 marLeft10"
            v-model="cd.values"
            :filterTreeNode="false">
          </a-tree-select>
          <div v-else-if="cd.inputType=='dataRange'" class="width-100 marLeft10">
            <a-input-number style=" width:32%; text-align: center" placeholder="1" v-model="cd.assertVal"  />
            <a-input style=" width: 12%; border-left: 0; pointer-events: none; backgroundColor: #fff" placeholder="~" disabled />
            <a-input-number style="width:32%; text-align: center; border-left: 0" v-model="cd.assertVal2" />
            <a-select defaultValue="1">
              <a-select-option value="1">年</a-select-option>
              <a-select-option value="2">月</a-select-option>
              <a-select-option value="3">日</a-select-option>
            </a-select>
          </div>
        </a-col>
        <a-col :span="1">
          <a-icon class="iconStyle" @click="deleteCon(index)" type="minus-circle" theme="filled"/>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'
  export default {
    name: 'condition-select',
    props: {
      conditions: {
        type: Array,
        required: true
      },
      treeData: {
        type: Array,
        required: true
      },
      classData: {
        type: Array,
        required: true
      },
      deleteCon: {
        type: Function,
        required: true
      },
      baseSelectTree: {
        type: Function,
        required: true
      },
      searchSelect:{
        type: Function,
      },
      searchTreeSelect:{
        type: Function,
      }
    },
    data() {

      return {
        api:{
          planSelectData: 'sys/reviewPlan/selectData',
        },
        selectMode: 'tags',
        ageType: this.enum.ageType
      }
    },
    mounted() {

    },
    methods: {
      changeAssert1(value,data){
        console.log(value);
        data.assertVal = value.data;
        // this.conditions.push();
        console.log(data.assertVal);
      },
      changeAssert2(value,data){
        data.assertVal1 = value.data;
        // this.conditions.push();
        console.log(data.assertVal);
      },
      //处理模型字段
      dealAllStartTree(list) {
        let indexData = {}
        for (let key in list) {
          let children = indexData[list[key].PID]
          if (children instanceof Array) {
            children.push({
              title: list[key].TITLE,
              value: '' + list[key].ID,
              key: list[key].ID,
              PID: list[key].PID
            })
          } else {
            children = [{
              title: list[key].TITLE,
              value: '' + list[key].ID,
              key: list[key].ID,
              PID: list[key].PID
            }]
          }
          indexData[list[key].PID] = children
        }
        return indexData
      },
      recursiveNodeTree(indexData, PID) {
        let children = indexData[PID]
        if (children != null && children != undefined) {
          for (let ckey in children) {
            let cnode = children[ckey]
            children[ckey].children = this.recursiveNodeTree(indexData, cnode.value)
          }
        }
        return children
      },

      getItemTreeData(code, trees) {
        let arrays = trees
        while (arrays != null && arrays.length > 0) {
          let temps = []
          for (let i = 0; i < arrays.length; i++) {
            if (arrays[i].code == code) {
              return arrays[i]
            } else if (arrays[i].children != null) {
              temps = temps.concat(arrays[i].children)
            }
          }
          //TODO:数据交换
          arrays = temps
        }
      }
    }
  }
</script>

<style>
  .treeStyle li.ant-select-tree-treenode-disabled > span:not(.ant-select-tree-switcher), li.ant-select-tree-treenode-disabled > .ant-select-tree-node-content-wrapper, li.ant-select-tree-treenode-disabled > .ant-select-tree-node-content-wrapper span {
    color: rgba(0, 0, 0, 0.65) !important;
    cursor: not-allowed;
  }
  .ant-select-tree-dropdown {
   max-height: 300px !important;
  }

</style>