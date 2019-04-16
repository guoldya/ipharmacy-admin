<template>
  <div>
    <a-row>
      <a-card>
        <h3>入院后医生医嘱偏差</h3>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          bordered size="middle"
          :customRow=rowstyle
          rowKey>
          <!--左边数据显示-->
          <template slot="specData" slot-scope="text, record">
            <div v-for="(item,index) in record.includeData">
              <div class="line" v-if="index == 0" style="margin-bottom:-8px "></div>
              <div class="words">
                {{item.spec}}
              </div>
              <div class="line" v-if="record.includeData[index+1] && index != record.includeData.length-1 && record.includeData[index+1].spec" style="height: 1px;background: #e8e8e8;"></div>
              <div class="line" v-if="record.includeData[index+1] && !record.includeData[index+1].spec" style="height: 1px;"></div>
              <div class="line" v-if="index == record.includeData.length-1 " style="margin-bottom:-8px "></div>
            </div>
          </template>
          <template slot="dosageData" slot-scope="text, record">
            <div v-for="(item,index) in record.includeData">
              <div class="line" v-if="index == 0" style="margin-bottom:-8px "></div>
              <div class="words">
                {{item.dosage}}
              </div>
              <div class="line" v-if="index != record.includeData.length-1 && record.includeData[index+1].dosage" style="height: 1px;background: #e8e8e8;"></div>
              <div class="line" v-if="record.includeData[index+1] &&!record.includeData[index+1].dosage" style="height: 1px;"></div>
              <div class="line" v-if="index == record.includeData.length-1" style="margin-bottom:-8px "></div>
            </div>
          </template>
          <template slot="freqData" slot-scope="text, record">
            <div v-for="(item,index) in record.includeData">
              <div class="line" v-if="index == 0" style="margin-bottom:-8px "></div>
              <div class="words">
                {{item.frequency}}
              </div>
              <div class="line" v-if="index != record.includeData.length-1 && record.includeData[index+1].frequency" style="height: 1px;background: #e8e8e8;"></div>
              <div class="line" v-if="record.includeData[index+1] &&!record.includeData[index+1].frequency" style="height: 1px;"></div>
              <div class="line" v-if="index == record.includeData.length-1" style="margin-bottom:-8px "></div>
            </div>
          </template>
          <!--右边数据显示-->
          <template slot="oldSpec" slot-scope="text, record">
            <div v-for="(item,index) in record.oldListData">
              <div class="line" v-if="index == 0" style="margin-bottom:-8px "></div>
              <div class="words">
                {{item.spec}}
              </div>
              <div class="line" v-if="index != record.oldListData.length-1 && record.oldListData[index+1].spec" style="height: 1px;background: #e8e8e8;"></div>
              <div class="line" v-if="record.oldListData[index+1] &&!record.oldListData[index+1].spec" style="height: 1px;"></div>
              <div class="line" v-if="index == record.oldListData.length-1" style="margin-bottom:-8px "></div>
            </div>
          </template>
          <template slot="oldDosage" slot-scope="text, record">
            <div v-for="(item,index) in record.oldListData">
              <div class="line" v-if="index == 0" style="margin-bottom:-8px "></div>
              <div class="words">
                {{item.dosage}}
              </div>
              <div class="line" v-if="index!= record.oldListData.length-1 && record.oldListData[index+1].dosage" style="height: 1px;background: #e8e8e8;"></div>
              <div class="line" v-if="record.oldListData[index+1] &&!record.oldListData[index+1].dosage" style="height: 1px;"></div>
              <div class="line" v-if="index == record.oldListData.length-1" style="margin-bottom:-8px "></div>
            </div>
          </template>
          <template slot="oldFreq" slot-scope="text, record">
            <div v-for="(item,index) in record.oldListData">
              <div class="line" v-if="index == 0" style="margin-bottom:-8px "></div>
              <div class="words">
                {{item.frequency}}
              </div>
              <div class="line" v-if="index != record.oldListData.length-1 && record.oldListData[index+1].frequency" style="height: 1px;background: #e8e8e8;"></div>
              <div class="line" v-if="record.oldListData[index+1] &&!record.oldListData[index+1].frequency" style="height: 1px;"></div>
              <div class="line" v-if="index == record.oldListData.length-1" style="margin-bottom:-8px "></div>
            </div>
          </template>
        </a-table>
      </a-card>
    </a-row>
  </div>
</template>

<script>
  const renderContent = (value, row, index) => {
    const obj = {
      children: value,
      attrs: {}
    }
    if (index === 4) {
      obj.attrs.colSpan = 0
    }
    return obj
  }

  export default {
    data() {
      const columns = [
        {
          title: '医嘱药物',
          children: [{
            title: '频次',
            dataIndex: 'freqData',
            scopedSlots: { customRender: 'freqData' },
          }, {
            title: '用药途径',
            dataIndex: 'dosageData',
            scopedSlots: { customRender: 'dosageData' },
          }, {
            title: '剂量',
            dataIndex: 'specData',
            scopedSlots: { customRender: 'specData' },
          }]
        },
        {
          title: '药品名称',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '重整药物',
          children: [{
            title: '剂量',
            dataIndex: 'spec',
            scopedSlots: { customRender: 'oldSpec' }
          }, {
            title: '用药途径',
            dataIndex: 'dosage',
            scopedSlots: { customRender: 'oldDosage' }
          }, {
            title: '频次',
            dataIndex: 'frequency',
            scopedSlots: { customRender: 'oldFreq' }
          }]
        }]
      return {
        columns,
        newData: [
          { name: '阿司匹林', spec: '80mg', dosage: '口服', frequency: '一日三次', num: 1 },
          { name: '阿司匹林', spec: '70mg', dosage: '口服', frequency: '一日一次', num: 2 },
          { name: '阿司匹林', spec: '60mg', dosage: '口服', frequency: '一日一次', num: 2 },
          { name: '阿司匹林', spec: '70mg', dosage: '口服', frequency: '一日一次', num: 3 },
          { name: '阿司匹林', spec: '90mg', dosage: '口服', frequency: '一日一次', num: 4 },
          { name: '阿司匹林', spec: '70mg', dosage: '口服', frequency: '一日一次', num: 3 },
          { name: '阿司匹林', spec: '90mg', dosage: '口服', frequency: '一日一次', num: 4 },
          { name: '阿莫西林', spec: '90mg', dosage: '口服', frequency: '一日一次', num: 1 },
          { name: '阿莫西林', spec: '90mg', dosage: '口服', frequency: '一日一次', num: 2 },
          { name: 'dddd', spec: '90mg', dosage: '口服', frequency: '一日一次', num: 1 },
          { name: '汉森死磨塘', spec: '90mg', dosage: '口服', frequency: '一日一次', num: 1 },
          { name: '汉森死磨塘', spec: '90mg', dosage: '口服', frequency: '一日一次', num: 1 }
        ],
        oldData: [
          {
            name: '阿司匹林',
            spec: '80mg',
            dosage: '口服',
            frequency: '一日三次'
          },
          {
            name: '阿莫西林',
            spec: '80mg',
            dosage: '口服',
            frequency: '一日三次'
          }, {
            name: '贝诺酯片',
            spec: '90mg',
            dosage: '口服',
            frequency: '一日一次',
            num: 1
          },
          {
            name: '乃诺普利胶囊',
            spec: '90mg',
            dosage: '口服',
            frequency: '一日一次',
            num: 1
          },
          {
            name: '乃诺普利胶囊',
            spec: '90mg',
            dosage: '口服',
            frequency: '一日一次',
            num: 1
          }
        ],
        dataSource: []
      }
    },
    mounted() {
      //处理数据
      this.handle()
    },
    methods: {
      rowstyle: function(record, index) {
        return {
          props: {},
          on: { // 事件
            click: () => {
            },       // 点击行
            mouseenter: () => {
            }  // 鼠标移入行
          }
        }
      },

      //处理数据
      handle: function() {
        let arr3 = this.oldData.concat(this.newData)
        let result = {}
        for (let i = 0; i < arr3.length; i++) {
          result[arr3[i].name] = arr3[i]//因为arr3[i].name不能重复,达到去重效果,且这里必须知晓"name"或是其他键名
        }
        for (let item in result) {
          this.dataSource.push({ name: result[item].name, includeData: [], oldListData: [] })
        }
        for (let key in this.dataSource) {
          for (let i in this.oldData) {
            if (this.dataSource[key].name == this.oldData[i].name) {
              this.dataSource[key].oldListData.push(this.oldData[i])
            }
          }
          for (let i in this.newData) {
            if (this.dataSource[key].name == this.newData[i].name) {
              this.dataSource[key].includeData.push(this.newData[i])
            }
          }
          this.dataSource[key].includeData.sort(function(a,b){
            if(a.spec>b.spec) return 1 ;
            if(a.spec<b.spec) return -1 ;
            return 0 ;
          }) ;
        }

        let arry = this.dataSource;
        for (let j=0;j<arry.length;j++){
          for (let i=arry[j].includeData.length-1;i>0;i--){
            if (arry[j].includeData[i-1] && arry[j].includeData[i].spec == arry[j].includeData[i-1].spec){
              delete arry[j].includeData[i].spec;
            }
            if (arry[j].includeData[i-1] && arry[j].includeData[i].dosage == arry[j].includeData[i-1].dosage){
              delete arry[j].includeData[i].dosage;
            }
            if (arry[j].includeData[i-1] && arry[j].includeData[i].frequency == arry[j].includeData[i-1].frequency){
              delete arry[j].includeData[i].frequency;
            }
          }
          for (let i=arry[j].oldListData.length-1;i>0;i--){
            if (arry[j].oldListData[i-1] && arry[j].oldListData[i].spec == arry[j].oldListData[i-1].spec){
              delete arry[j].oldListData[i].spec;
            }
            if (arry[j].oldListData[i-1] && arry[j].oldListData[i].dosage == arry[j].oldListData[i-1].dosage){
              delete arry[j].oldListData[i].dosage;
            }
            if (arry[j].oldListData[i-1] && arry[j].oldListData[i].frequency == arry[j].oldListData[i-1].frequency){
              delete arry[j].oldListData[i].frequency;
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .line {
    margin-left: -8px;
    margin-right: -8px;
  }

  .words {
    height: 21px;
    margin-bottom: 8px;
    margin-top: 8px
  }
</style>