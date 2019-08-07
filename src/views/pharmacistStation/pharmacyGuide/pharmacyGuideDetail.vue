<template>
    <div class="pharmacyGuideDetail">
      <a-card>
        <a-row :gutter="10">
          <a-col :xl="8" :xxl="5">
            <div class="ruleCow">
              <a-card>
                <a-input-search style="width: 275px" class="txtCenter" placeholder="输入要查询日期" @search="" />
                <a-list size="large" class="margin-top-10" bordered :dataSource="date">
                  <a-list-item style="padding-left: 38%;" slot="renderItem" slot-scope="item, index">{{item}}</a-list-item>
                </a-list>
              </a-card>
            </div>
          </a-col>
          <a-col :xl="16" :xxl="19">
            <a-card>
               <a-icon type="star" class="star" theme="filled" :style="{ color: '#1890ff' }" />
              <a-row>
                <span class="titleText font-bold fontSize36">梁汉文</span>
                <span class="titleText margin-left-20">
                  <a-tag
                    class="tagStyle"
                    :color="'#40a9ff'"
                    :key="1"
                  >91084654</a-tag>
                  <a-tag
                    class="tagStyle"
                    :color="'#40a9ff'"
                    :key="2"
                  >肝</a-tag>
                  <a-tag
                    class="tagStyle"
                    :color="'#58C7CF'"
                    :key="3"
                  >肾</a-tag>
                  <a-tag
                    class="tagStyle"
                    :color="'#B497EE'"
                    :key="4"
                  >心</a-tag>
                </span>
              </a-row>
              <a-row class="fontSize16 margin-top-10">
                <span>男</span>
                <a-divider type="vertical"/>
                <span>35岁</span>
                <a-divider type="vertical"/>
                <span>皮肤科 5病区/2床</span>
                <a-divider type="vertical"/>
                <span>医护：胡清/黄晶锐</span>
                <a-divider type="vertical"/>
                <span>入院日期：2019-08-05</span>
              </a-row>
              <p class="margin-top-10">诊断：过敏性皮炎</p>
            </a-card>
            <a-card class="margin-top-5" style="border-bottom: none;">
              <div class="medicineGuide">
                <span><a-icon type="medicine-box" /> 指导信息</span>
                <span>
                  <a-button @click="backTo"><a-icon type="arrow-left" />返回</a-button>
                  <a-button type="primary">新增</a-button>
                  <a-button type="primary">保存</a-button>
              </span>
              </div>

            </a-card>
            <a-card title="基本信息">
              <a-row>
                <a-col :span="2">指导对象：</a-col>
                <a-col :span="4">
                  <a-radio-group name="radioGroup" :defaultValue="1">
                    <a-radio :value="1">医生</a-radio>
                    <a-radio :value="2">护士</a-radio>
                  </a-radio-group>
                </a-col>

                <a-col :span="18">
                  <a-input placeholder="范华" style="width: 200px;margin-left: 12px"/>
                  <a-input placeholder="15245647896" style="width: 200px;margin-left: 12px" />
                </a-col>
              </a-row>

              <a-row class="margin-top-10">
                <a-col :span="2">紧急程度：</a-col>
                <a-col :span="22">
                  <a-radio-group name="radioGroup" :defaultValue="1">
                    <a-radio :value="1">高</a-radio>
                    <a-radio :value="2">中</a-radio>
                    <a-radio :value="3">低</a-radio>
                  </a-radio-group>
                </a-col>
              </a-row>

              <a-row class="margin-top-10">
                <a-col :span="8">
                  记录时间：
                  <a-input placeholder="2019-06-30" style="width: 200px;margin-left: 24px" />
                </a-col>
                <a-col :span="16">
                  有效时间：
                  <a-input placeholder="2019-07-30" style="width: 200px;margin-left: 24px" />
                </a-col>
              </a-row>

              <a-row class="margin-top-10">
                <a-col :span="2">指导类别：</a-col>
                <a-col :span="22">
                  <a-checkbox-group  :options="plainOptions" v-model="checkValue" @change="onChange" />
                </a-col>
              </a-row>
            </a-card>

            <div class="plusBtn margin-top-10"><a-button type="primary"><a-icon type="plus" />问题医嘱</a-button></div>

            <a-spin :spinning="loading" tip="加载中...">
              <el-table
                highlight-current-row
                class="margin-top-10"
                :data="doctorAdviceContentData" border
              >
                <el-table-column
                  v-for="item in doctorAdviceContentColumns"
                  :show-overflow-tooltip="true"
                  :key="item.value"
                  :label="item.title"
                  :prop="item.value"
                  :width="item.width"
                  :align="item.align"
                >
                </el-table-column>
                <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
                  <template slot-scope="scope">
                   <span>删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </a-spin>

            <div class="disFlex margin-top-10">
              <span>医嘱信息：</span>
              <span><a-button type="primary"><a-icon type="plus" />医嘱信息</a-button></span>
            </div>

            <a-spin :spinning="loading" tip="加载中...">
              <el-table
                highlight-current-row
                class="margin-top-10"
                :data="doctorAdviceContentData" border
              >
                  <el-table-column
                    v-for="item in doctorAdviceInfoColumns"
                    :show-overflow-tooltip="true"
                    :key="item.value"
                    :label="item.title"
                    :prop="item.value"
                    :width="item.width"
                    :align="item.align"
                  >
                  </el-table-column>
                <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
                  <template slot-scope="scope">
                    <span>删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </a-spin>

            <div class="disFlex margin-top-10">
              <span>用药建议内容：</span>
              <span class="btnGroup">
                <a-button type="primary"><a-icon type="plus" />另存为模板</a-button>
                <a-button type="primary"><a-icon type="plus" />模板引用</a-button>
                <a-button type="primary"><a-icon type="file-text" />查房便签</a-button>
                <a-button type="primary"><a-icon type="experiment" />化验信息</a-button>
              </span>
            </div>

            <a-textarea class="margin-top-10" :autosize="{minRows: 4,maxRows: 6 }" />

          </a-col>
        </a-row>
      </a-card>
    </div>
</template>

<script>
  export default {
    name: 'pharmacyGuideDetail',
    data(){
      return{
        date:['2019-08-01','2019-08-02','2019-08-03',
          '2019-08-04','2019-08-05','2019-08-06',
          '2019-08-07'
        ],
        loading:false,
        data:[{time:'2010-01-01'},{time:'2011-01-01'},{time:'2012-01-01'}],
        doctorAdviceContentData:[],
        plainOptions:[
          { label: '用法用量', value: '1' },
          { label: '方案疗程', value: '2' },
          { label: '给药途径', value: '3' },
          { label: '联合用药', value: '4' },
        ],
        checkValue:['1'],
        doctorAdviceContentColumns:[
          { title: '医嘱类容', dataIndex: 'planName', width: 250,align: 'left' },
          { title: '问题类别', dataIndex: 'planType', align: 'left', width: 100,format:this.planType },
          { title: '问题描述', dataIndex: 'planScope', align: 'left', width: 100,format:this.planScope },
          { title: '创建时间', dataIndex: 'describe' , align: 'left'},
        ],
        doctorAdviceInfoColumns:[
          { title: '医嘱类型', dataIndex: 'planName', width: 250 , align: 'left'},
          { title: '类别', dataIndex: 'planType', align: 'left', width: 100,format:this.planType },
          { title: '医嘱项目名称', dataIndex: 'planScope1', align: 'left', width: 100,format:this.planScope },
          { title: '频次', dataIndex: 'planScope2', align: 'left', width: 100,format:this.planScope },
          { title: '剂量', dataIndex: 'describe' , align: 'left'},
          { title: '用法', dataIndex: 'planScope3', align: 'left', width: 100,format:this.planScope },
          { title: '备注', dataIndex: 'planScope4', align: 'left', width: 100,format:this.planScope },
        ],
        doctorAdviceInfoData:[],
        medicineAdviceInfoColumns:[],
        medicineAdviceInfoData:[],
      }
    },
    methods:{
      onChange (checkedValues) {
        console.log('checked = ', checkedValues)
        console.log('value = ', this.checkValue)
      },
      headerCellStyle({row, rowIndex}){
        return 'display:none'
      },
      backTo(){
        this.$router.push({
          name: 'index',
          // path:'index'
        })
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.ruleCow  .ant-card-body {
    padding: 15px 0 ;
    text-align: center;
  }
  .star{
    float: right;
    font-size: 20px;
    background-color: lightblue;
    padding:6px;
    position: relative;
    top: -25px;
  }
 .pharmacyGuideDetail {
   .btnGroup button:not(:last-child){
     margin-right: 8px;
   }
   .plusBtn{
     text-align: right;
   }
     .medicineGuide{
       display: flex;
       justify-content: space-between;
       align-items: center;
       span:last-child button:not(:first-child){
         margin-left: 8px;
       }
     }
   .ant-card {
     .userInfo {
       font-weight: bold;
       .userName {
         margin-top: -9px;
         span{
           font-size: 24px;
           color: #1890ff;
         }
       }
       .userNum span{
         color: #fff;
         background-color: #1890ff;
         padding: 4px 6px;
       }
       .item {
         span{
           color: #fff;
           padding: 4px 6px;
         }
         span:first-child{
           background-color: #1890ff;
         }
         span:nth-child(2){
           background-color: lightgreen;
         }
         span:last-child{
           background-color: mediumpurple;
         }
       }
       div span{
         margin: 0 4px;
       }
     }
   }
 }
</style>