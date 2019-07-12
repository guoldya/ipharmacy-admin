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
                  <!--<div class="line" v-if="scope.row.includeData[index+1] &&!scope.row.includeData[index+1].frequency" style="height: 1px;"></div>-->
                  <div class="line" v-if="index == scope.row.includeData.length-1" style="margin-bottom:-8px "></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="dosage"
              label="用药途径"
            >
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.includeData">
                  <div class="line" v-if="index == 0" style="margin-bottom:-8px "></div>
                  <div>
                    {{item.dosage}}
                  </div>
                  <div class="line" v-if="index != scope.row.includeData.length-1 && scope.row.includeData[index+1].dosage" style="height: 1px;background: #e8e8e8;"></div>
                  <div class="line" v-if="index == scope.row.includeData.length-1" style="margin-bottom:-8px "></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="spec"
              label="剂量"
            >
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.includeData">
                  <!--<div class="line" v-if="index == 0" style="margin-bottom:-8px "></div>-->
                  <div>
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
              prop="oldSpec"
              label="剂量"
            >
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.oldListData">
                  <div class="line" v-if="index == 0" style="margin-bottom:-8px "></div>
                  <div>
                    {{item.oldSpec}}
                  </div>
                  <div class="line" v-if="index != scope.row.oldListData.length-1 && scope.row.oldListData[index+1].oldSpec" style="height: 1px;background: #e8e8e8;"></div>
                  <!--<div class="line" v-if="scope.row.oldListData[index+1] &&!scope.row.oldListData[index+1].oldSpec" style="height: 1px;"></div>-->
                  <div class="line" v-if="index == scope.row.oldListData.length-1" style="margin-bottom:-8px "></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="oldDosage"
              label="用药途径"
            >
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.oldListData">
                  <div class="line" v-if="index == 0" style="margin-bottom:-8px "></div>
                  <div>
                    {{item.oldDosage}}
                  </div>
                  <div class="line" v-if="index != scope.row.oldListData.length-1 && scope.row.oldListData[index+1].dosage" style="height: 1px;background: #e8e8e8;"></div>
                  <div class="line" v-if="index == scope.row.oldListData.length-1" style="margin-bottom:-8px "></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="oldFrequency"
              label="频次"
            >
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.oldListData">
                  <div class="line" v-if="index == 0" style="margin-bottom:-8px "></div>
                  <div class="words">
                    {{item.oldFrequency}}
                  </div>
                  <div class="line" v-if="index != scope.row.oldListData.length-1 && scope.row.oldListData[index+1].oldFrequency" style="height: 1px;background: #e8e8e8;"></div>
                  <!--<div class="line" v-if="scope.row.oldListData[index+1] &&!scope.row.oldListData[index+1].oldFrequency" style="height: 1px;"></div>-->
                  <div class="line" v-if="index == scope.row.oldListData.length-1" style="margin-bottom:-8px "></div>
                </div>
              </template>
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

        newData: [
          { name: '阿司匹林', spec: '80mg', dosage: '口服', frequency: '一日二次', num: 1 },
        ],
        oldData: [
          {
            name: '阿司匹林',
            oldSpec: '80mg',
            oldDosage: '口服',
            oldFrequency: '一日三次'
          },
          {
            name: '阿莫西林',
            oldSpec: '80mg',
            oldDosage: '口服',
            oldFrequency: '一日三次'
          }, {
            name: '贝诺酯片',
            oldSpec: '90mg',
            oldDosage: '口服',
            oldFrequency: '一日一次',
            num: 1
          },
          {
            name: '乃诺普利胶囊',
            oldSpec: '90mg',
            oldDosage: '口服',
            oldFrequency: '一日一次',
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
            if(a.frequency>b.frequency) return 1 ;
            if(a.frequency<b.frequency) return -1 ;
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
        };
        console.log(this.dataSource);
      },
      arraySpanMethod: function({ row, column, rowIndex, columnIndex }) {
        console.log(row, 'row')
        console.log(column, 'column')
        if (columnIndex === 3) {
          if (rowIndex === 0) {
            return {
              rowspan: 3,
              colspan: 1
            }
          } else if (rowIndex < 3) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
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