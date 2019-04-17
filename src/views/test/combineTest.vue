<template>
  <div>
    <a-row>
      <a-card>
        <h3>入院后医生医嘱偏差</h3>
        <el-table
          class="margin-top-10"
          ref="singleTable"
          :data="dataSource"
          border
          size="small"
          style="width: 60%"
          highlight-current-row>
          <el-table-column label="医嘱药物">
            <el-table-column
              :show-overflow-tooltip="true"
              prop="frequency"
              label="频次"
            >
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.includeData">
                  <div class="line" v-if="index == 0 " style="margin-bottom:-8px "></div>
                  <div style=" margin-bottom: 8px;margin-top: 8px">
                    {{item.frequency}}
                  </div>
                  <div class="line" v-if="index != scope.row.includeData.length-1 && scope.row.includeData[index+1].frequency" style="height: 1px;background: #e8e8e8;"></div>
                  <div class="line" v-if="index == scope.row.includeData.length-1" style="margin-bottom:-8px "></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="dosages"
              label="用药途径"
            >
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.includeData">
                  <div  v-if="index == 0">
                    {{item.dosage}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="specs"
              label="剂量"
            >
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.includeData">
                  <div v-if="index == 0">
                    {{item.spec}}
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="药品名称"
                           :show-overflow-tooltip="true"
                           prop="name"
                           width="100"
                           align="center">
          </el-table-column>
          <el-table-column label="重整用药">
            <el-table-column
              :show-overflow-tooltip="true"
              prop="spec"
              label="剂量"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="dosage"
              label="用药途径"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="frequency"
              label="频次"
            >
            </el-table-column>
          </el-table-column>
        </el-table>
        <!--<a-pagination-->
        <!--showSizeChanger-->
        <!--:total="total"-->
        <!--class="pnstyle"-->
        <!--:defaultPageSize="pageSize"-->
        <!--:pageSizeOptions="['10', '20','50']"-->
        <!--@showSizeChange="pageChangeSize"-->
        <!--@change="pageChange"-->
        <!--size="small"-->
        <!--&gt;-->
        <!--</a-pagination>-->
      </a-card>
    </a-row>
    <el-color-picker v-model="color1"></el-color-picker>
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
      return {
        color1: '#409EFF',
        newData: [
          { name: '阿司匹林', spec: '80mg', dosage: '阿司匹林阿司匹林阿司匹林', frequency: '一日三次', num: 1 },
          { name: '阿司匹林', spec: '80mg', dosage: '阿司匹林阿司匹林阿司匹林', frequency: '一日八次', num: 1 },
          { name: '阿司匹林', spec: '80mg', dosage: '阿司匹林阿司匹林阿司匹林', frequency: '一日一次', num: 2 },
          { name: '阿司匹林', spec: '80mg', dosage: '阿司匹林阿司匹林阿司匹林', frequency: '一日一次', num: 2 },
          { name: '阿司匹林', spec: '80mg', dosage: '口阿司匹林阿司匹林阿司匹林服', frequency: '一日一次', num: 2 },
          { name: '阿司匹林', spec: '80mg', dosage: '阿司匹林阿司匹林阿司匹林', frequency: '一日三次', num: 2 },
          { name: '阿司匹林', spec: '80mg', dosage: '阿司匹林阿司匹林阿司匹林', frequency: '一日三次', num: 2 },
          { name: '阿司匹林', spec: '80mg', dosage: '阿司匹林阿司匹林阿司匹林', frequency: '一日两次', num: 2 },
          { name: '阿司匹林', spec: '80mg', dosage: '阿司匹林阿司匹林阿司匹林', frequency: '一日五次', num: 2 },
          { name: '阿莫西林', spec: '90mg', dosage: '口服', frequency: '一日一次', num: 1 },
          { name: '阿莫西林', spec: '90mg', dosage: '口服', frequency: '一日一次', num: 2 },
          { name: '阿莫西林', spec: '90mg', dosage: '口服', frequency: '一日三次', num: 2 },
          { name: '贝诺酯片', spec: '90mg', dosage: '口服', frequency: '一日三次', num: 2 }
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
          }
        ],
        dataSource: [],
        rowListData: [],
        total:10,
        pageSize:10,
      }
    },
    mounted() {
      //处理数据
      this.handle()
    },
    methods: {
      //处理数据
      handle: function() {
        let arr3 = this.oldData.concat(this.newData)
        let result = {}
        for (let i = 0; i < arr3.length; i++) {
          result[arr3[i].name] = arr3[i]
        }
        for (let item in result) {
          this.dataSource.push({ name: result[item].name, includeData: [], })
        }
        this.dataSource = this.pushData(this.dataSource);
        console.log(this.dataSource);
      },
      pushData(data){
        for (let key in data) {
          if (data[key].name == this.oldData[key].name) {
            data[key].spec = this.oldData[key].spec;
            data[key].dosage = this.oldData[key].dosage
            data[key].frequency = this.oldData[key].frequency
          }
          for (let i in this.newData) {
            if (data[key].name == this.newData[i].name) {
              data[key].includeData.push(this.newData[i])
            }
          }
          data[key].includeData.sort(function(a,b){
            if(a.frequency>b.frequency) return 1 ;
            if(a.frequency<b.frequency) return -1 ;
            return 0 ;
          }) ;
        }
        let arry = data;
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
        }
        return arry;
      },
      pageChangeSize(){

      },
      pageChange(){

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
    height:30px;
    margin-bottom: 8px;
    margin-top: 8px
  }
  /deep/.el-table .cell{
  line-height: 30px;
  }
</style>