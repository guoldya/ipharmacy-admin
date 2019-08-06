<template>
    <div class="pharmacyGuideDetail">
      <a-card>
        <a-row class="ruleRow" :gutter="10">
          <a-col :xl="8" :xxl="5">
            <div class="ruleCow">
              <a-card>
                <a-row>
                  <a-col :span="18">
                    <a-input-search
                      @pressEnter=""
                      style="width: 200px"
                      @search=""
                      placeholder="输入要查询的日期"
                      @change=''
                    />
                  </a-col>
                </a-row>
                <a-row>
                    <a-col>

                    </a-col>
                </a-row>
              </a-card>
            </div>
          </a-col>
          <a-col :xl="16" :xxl="19">
            <a-card>
              <a-row class="userInfo">
                <a-col :span="3" class="userName"><span>梁汉文</span></a-col>
                <a-col :span="4" class="userNum"><span>656565655</span></a-col>
                <a-col :span="5" class="item">
                  <span>肝</span>
                  <span>肾</span>
                  <span>心</span>
                </a-col>
              </a-row>
              <a-row class="margin-top-10">
                <a-col :span="2"><span>男</span></a-col>
                <a-col :span="2"><span>35岁</span></a-col>
                <a-col :span="4"><span>皮肤科 5病区 2床</span></a-col>
                <a-col :span="4"><span>医护：张三/李四</span></a-col>
                <a-col :span="4"><span>入院日期：2019-01-01</span></a-col>
              </a-row>
              <a-row class="margin-top-10">
                <a-col><span>诊断：过敏性皮炎</span></a-col>
              </a-row>
              <div>

              </div>
            </a-card>
            <a-card class="margin-top-5" style="border-bottom: none;">
              <div class="medicineGuide">
                <span><a-icon type="medicine-box" /> 指导信息</span>
                <span>
                  <a-button @click=""><a-icon type="arrow-left" />返回</a-button>
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
                  <a-input placeholder="large size" style="width: 200px;margin-left: 12px"/>
                  <a-input placeholder="large size" style="width: 200px;margin-left: 12px" />
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
                  <a-input placeholder="large size" style="width: 200px;margin-left: 24px" />
                </a-col>
                <a-col :span="16">
                  有效时间：
                  <a-input placeholder="large size" style="width: 200px;margin-left: 24px" />
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
              <a-table
                class="margin-top-10"
                :columns="doctorAdviceContentColumns"
                :data="doctorAdviceContentData" border
                :highlight-current-row="true"
              >
                <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
                  <template slot-scope="scope">
                   <span>删除</span>
                  </template>
                </el-table-column>
              </a-table>
            </a-spin>

            <div class="disFlex margin-top-10">
              <span>医嘱信息：</span>
              <span><a-button type="primary"><a-icon type="plus" />医嘱信息</a-button></span>
            </div>

            <a-spin :spinning="loading" tip="加载中...">
              <a-table
                class="margin-top-10"
                :columns="doctorAdviceInfoColumns"
                :data="doctorAdviceInfoData" border
                :highlight-current-row="true"
              >
                <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
                  <template slot-scope="scope">
                    <span>删除</span>
                  </template>
                </el-table-column>
              </a-table>
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

            <a-textarea class="margin-top-10" :autosize="{maxRows: 6 }" />

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
        loading:false,
        data:[{time:'2010-01-01'},{time:'2011-01-01'},{time:'2012-01-01'}],
        doctorAdviceContentData:[],
        plainOptions:['用法用量','方案疗程','给药途径','联合用药'],
        checkValue:[],
        doctorAdviceContentColumns:[
          { title: '医嘱类容', dataIndex: 'planName', width: 250 },
          { title: '问题类别', dataIndex: 'planType', align: 'center', width: 100,format:this.planType },
          { title: '问题描述', dataIndex: 'planScope', align: 'center', width: 100,format:this.planScope },
          { title: '创建时间', dataIndex: 'describe' },
        ],
        doctorAdviceInfoColumns:[
          { title: '医嘱类型', dataIndex: 'planName', width: 250 },
          { title: '类别', dataIndex: 'planType', align: 'center', width: 100,format:this.planType },
          { title: '频次', dataIndex: 'planScope1', align: 'center', width: 100,format:this.planScope },
          { title: '频次', dataIndex: 'planScope2', align: 'center', width: 100,format:this.planScope },
          { title: '剂量', dataIndex: 'describe' },
          { title: '用法', dataIndex: 'planScope3', align: 'center', width: 100,format:this.planScope },
          { title: '备注', dataIndex: 'planScope4', align: 'center', width: 100,format:this.planScope },
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
    }
  }
</script>

<style scoped lang="less">
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