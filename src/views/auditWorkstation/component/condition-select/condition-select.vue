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
          <a-select
            class="width-100 margin-left-5"
            v-model="cd.relation"
            @change="relationChange($event,cd.logic,cd.ruleId)"
          >
            <a-select-option
              v-for="item in cd.operators"
              :value='item.id'
              :key="index"
            >
              {{item.text}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col v-if="cd.inputType=='input'" :span="4">
          <!--文本输入框-->
          <div >
            <a-input style="width: 94%" @change="onChange"  class="width-100 marLeft10" v-model="cd.assertVal"></a-input>
          </div>
        </a-col>
        <a-col  v-else-if="cd.inputType=='select'" :span="4">
          <!--下拉框-->
          <a-select
            mode='multiple'
            @search="searchSelect($event,cd.treeData,cd.columnId,cd)"

            class="width-100 marLeft10"
            v-model="cd.values"
            :filterOption="false"
            :key="cd.key"
            @change="onChange"
          >
            <a-select-option
              v-for="item in cd.treeData"
              :value='item.ID'
              :key="item.ID"
            >
              {{item.TITLE}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col v-else-if="cd.inputType=='tree'" :span="4">
          <!--树-->
          <a-tree-select
            multiple
            @search="searchTreeSelect($event,cd.treeData,cd.columnId,cd)"
            :treeData="cd.treeData"

            class="width-100 marLeft10"
            v-model="cd.values"
            @change="onChange"
            :filterTreeNode="false">
          </a-tree-select>
        </a-col>
        <a-col v-else-if="cd.inputType=='dataRange'" :span="4">
          <!--范围-->
          <div  class="width-100 marLeft10">
            <a-input-number @change="onChange"  :max="cd.assertVal2" class="rangeLeft" v-model="cd.assertVal"  />
            <a-input class="rangeCenter" placeholder="~" disabled />
            <a-input-number @change="onChange" :min="cd.assertVal" class="rangeRight"  v-model="cd.assertVal2" />
            <a-select
              v-if="cd.columnId == 'AGE' && cd.logic == '2'"
              @change="assertValSpec($event,cd.ruleId)"
              :defaultValue="cd.spec"
              style="width: 19%"
            >
              <a-select-option
                v-for="item in ageType"
                :value='item.id'
                :key="item.id"
              >
                {{item.text}}
              </a-select-option>
            </a-select>
            <a-input style="width:18%;" v-else value="天" disabled>
            </a-input>
          </div>
        </a-col>
        <a-col v-if="cd.inputType=='inputNumber'" :span="3">
          <!--文本数字-->
          <div >
            <a-input type="number" style="width: 94%" @change="onChange"  class="width-100 marLeft10" v-model="cd.assertVal"></a-input>
          </div>
        </a-col>
        <a-col  v-if="cd.columnId == 'AGE' && cd.logic == '1'" :span='1'>
          <a-select
            @change="assertValSpec($event,cd.ruleId)"
            :defaultValue="cd.spec"
            style="width: 100%"
          >
            <a-select-option
              v-for="item in ageType"
              :value='item.id'
              :key="item.id"
            >
              {{item.text}}
            </a-select-option>
          </a-select>
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
        ageType: this.enum.ageType,
        inDay:'1',
      }
    },
    mounted() {
      console.log(this.conditions)
    },
    methods: {
      relationChange(value,logic,ruleId){
        for (let key in this.conditions){
          if (ruleId == this.conditions[key].ruleId){
            if (logic <'3'){
              if (value != '9'){
                this.conditions[key].inputType = 'inputNumber'
                this.conditions[key].logic = '1';
              }else{
                this.conditions[key].inputType = 'dataRange'
                this.conditions[key].logic = '2';
              }
            }
          }
        }
        this.conditions.push();
      },
      assertValSpec(value,ruleId){
        console.log(value,'va')
        for (let key in this.conditions){
          if (ruleId == this.conditions[key].ruleId){
              this.conditions[key].spec = ''+value
          }
        }
      },

      //树选择事件
      onChange(){
        this.$forceUpdate();
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
  .rangeCenter{
    width: 12%;
    border-right: 0;
    border-left: 0;
    margin-left: 1px;
    pointer-events: none;
    backgroundColor: #fff
  }
  .rangeLeft{
    width:32%;
    text-align: center;
    border-right: 0px
  }
  .rangeRight{
    width:32%;
    text-align: center;
    border-left: 0px
  }

</style>