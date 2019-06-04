<template>
  <div>
    <div v-for="(cd,index) in conditions" class="margin-top-10">
      <a-row>
        <a-col :span="7"></a-col>
        <a-col :span="4">
          <a-tree-select
            class="width-100"
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
        <a-col :span="3">
          <!--文本输入框-->
          <a-input v-if="cd.inputType=='input'" class="width-100 marLeft10" v-model="cd.assertVal"></a-input>
          <!--下拉框-->
          <a-select
            mode="multiple"
            v-else-if="cd.inputType=='select'"
            class="width-100 marLeft10"
            v-model="cd.values"
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
            :treeData="cd.treeData"
            v-else-if="cd.inputType=='tree'"
            class="width-100 marLeft10"
            v-model="cd.values">
          </a-tree-select>

          <!--日期框-->
          <!--<a-date-picker class="width-100 marLeft10" v-else-if="cd.isCheckbox==3" v-model="cd.value"></a-date-picker>-->
          <!--日期范围-->
          <!--<a-range-picker class="width-100 marLeft10" v-else-if="cd.val==6" v-model="cd.list"/>-->
          <!--数字范围-->
          <div v-else-if="cd.inputType=='dataRange'" class="width-100 marLeft10">
            <a-input-number v-model="cd.assertVal" style="width:44%"></a-input-number>
            <span>~</span>
            <a-input-number v-model="cd.assertVal2" style="width:44%"></a-input-number>
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
      levelData: {
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
      }
    },
    data() {
      return {
        selectMode: 'tags'
      }
    },
    mounted(){
      console.log(this.conditions,'1');
    },
    methods: {
      // baseSelectTree(index, item) {
      //   console.log(index, 'index')
      //   console.log(item, 'item')
      //   console.log(item.val, 'val')
      //   console.log(this.getItemTreeData(item.val, this.treeData), 'childNodes')
      // },
      getItemTreeData(code, trees) {
        let arrays = trees
        while (arrays != null && arrays.length > 0) {
          let temps=[];
          for (let i=0; i < arrays.length; i++) {
            if (arrays[i].code == code) {
              return arrays[i]
            } else if (arrays[i].children != null) {
              temps= temps.concat(arrays[i].children);
            }
          }
          //TODO:数据交换
          arrays=temps;
        }
      }
    }
  }
</script>

<style scoped>

</style>