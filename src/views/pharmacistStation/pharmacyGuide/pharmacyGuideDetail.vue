<template>
    <div class="pharmacyGuideDetail">
        <a-row :gutter="10">
          <a-col :xl="8" :xxl="5" v-if="page===JSON.stringify('look')">
            <dateList :date="date"></dateList>
          </a-col>
          <a-col  :xxl="page===JSON.stringify('look')?19:24" :xl="page===JSON.stringify('look')?16:24">
           
            <detailHeader :userName="userName" :tagList="tagList" :userInfo="userInfo" :diag="diag"></detailHeader>
            
            <a-card class="margin-top-5 borderNone">
              <div class="medicineGuide">
                <span class="font-bold fontSize16"><a-icon type="medicine-box" /> 指导信息</span>
                <span>
                  <a-button @click="backTo"><a-icon type="arrow-left" />返回</a-button>
                  <a-button type="primary" v-if="page===JSON.stringify('look')">新增</a-button>
                  <a-button type="primary" @click="handleSubmit">保存</a-button>
              </span>
              </div>

            </a-card>
            <a-card title="基本信息">
              <a-form class="margin-top-10"
             :form="form" >

                <a-row  >
                  <a-col
                  v-for="(list,i) in formItem" :key="i"
                    :span="list.span"
                    >
                    <a-form-item :label="list.label" class="unit"
                    :label-col="{ span: i===2||i===3?'8':'2' }"
                    :wrapper-col="{ span: i===2||i===3?'16':'22' }">
                        
                        <a-radio-group v-decorator="[list.val,{initialValue: '1'}]" name="radioGroup" v-if="list.type==='radio'">
                            <a-radio
                            v-for="(itemRadio,index) in list.radioItem" :key="index" :value="itemRadio.value">{{itemRadio.name}}
                            </a-radio>
                            <span >
                              <a-input placeholder="范华" v-decorator="['val1']" v-if="i===0" class="inputStyle "/>
                             <a-input placeholder="15245647896"  v-decorator="['val2']" v-if="i===0" class=inputStyle />
                            </span>
                        </a-radio-group>
                        
                        <a-date-picker v-decorator="[list.val]" @change="onChange" v-if="list.type==='date'"/>

                        <a-input v-if="list.type==='input'" v-decorator="[list.val]" placeholder="请输入..."/>
                        <span v-if="list.type==='checkbox'">
                            <a-checkbox-group v-decorator="[list.val,{initialValue: ['1']}]">
                              <a-checkbox
                                v-for="(op,index) in list.options"
                                :value="op.value"
                                :key="index"
                              >{{op.label}}</a-checkbox>
                            </a-checkbox-group>
                        </span>
                    </a-form-item>
                </a-col>
              </a-row>

              <div class="disFlex margin-top-10">
                <span  class="font-bold fontSize16">问题医嘱：</span>
                <span><a-button type="primary"><a-icon type="plus" />问题医嘱</a-button>
                </span>
              </div>

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
                    <template>
                     <span>删除</span>
                    </template>
                  </el-table-column>
                </el-table>
              </a-spin>

              <div class="disFlex margin-top-10">
                <span  class="font-bold fontSize16">医嘱信息：</span>
                <span ><a-button type="primary"><a-icon type="plus" />医嘱信息</a-button></span>
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
                    <template>
                      <span>删除</span>
                    </template>
                  </el-table-column>
                </el-table>
              </a-spin>

              <div class="disFlex margin-top-10">
                <span class="font-bold fontSize16">用药建议内容：</span>
                <span class="btnGroup">
                  <a-button class="greenBg"><a-icon type="plus" />另存为模板</a-button>
                  <a-button type="primary"><a-icon type="plus" />模板引用</a-button>
                  <a-button  class=orangeBg><a-icon type="file-text" />查房便签</a-button>
                  <a-button  class="greenBg"><a-icon type="experiment" />化验信息</a-button>
                </span>
              </div>
              <a-form-item>
                <a-textarea  v-decorator="['txtContent']" class="margin-top-10" :autosize="{minRows: 4,maxRows: 6 }" />
              </a-form-item>
             </a-form>
            
            </a-card>
          </a-col>
        </a-row>
    </div>
</template>

<script>
  export default {
    name: 'pharmacyGuideDetail',
    data(){
      return{
        userName:'梁汉文',
            tagList:[
                {tag:'91084654',color:'#40a9ff'},
                {tag:'肝',color:'#40a9ff'},
                {tag:'肾',color:'#58C7CF'},
                {tag:'心',color:'#B497EE'},

            ],
            userInfo:{
                sex:'男',
                age:'35岁'  ,
                dept:'皮肤科',
                stage:' 5病区/2床',
                docNurse:'胡清/黄晶锐',
                date:'2019-08-05'
            },
            diag:'过敏性皮炎',
        date:['2019-08-11','2019-08-02','2019-08-03',
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
        form: this.$form.createForm(this),
        formItem:[
          {label:'指导对象',type:'radio',val:'date',span:'24',radioItem:[
              {value:'1',name:'医生'},
              {value:'2',name:'护士'},
            ]
          },
          {label:'紧急程度',type:'radio',val:'day',span:'24',radioItem:[
               {value:'1',name:'高'},
              {value:'2',name:'中'},
               {value:'3',name:'低'},
              ]
           },
          {label:'记录时间',type:'date',val:'dateRecoed',span:'6'},
           {label:'有效时间',type:'date',val:'validDate',span:'6'},
          {label:'指导类别',type:'checkbox',val:'iphoneNumber',span:'24',
            options:[
              { label: '用法用量', value: '1' },
              { label: '方案疗程', value: '2' },
              { label: '给药途径', value: '3' },
              { label: '联合用药', value: '4' },
            ]
          } 
        ],
        val1:'',
        val2:''
      }
    },
    props:{

    },
    mounted(){
       if(localStorage.childPage===JSON.stringify('look')){
         document.title=document.title+'用药指导详情';
        }else if(localStorage.childPage===JSON.stringify('add')){
          document.title=document.title.split('用')[0]+'用药指导新增';
        }
    },
    computed:{
      page(){
        return localStorage.childPage
      }
    },
    methods:{
      handleSubmit(e){
        e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                  console.log(values)
                }
            })
      },
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
  
  .star{
    float: right;
    font-size: 20px;
    background-color: #DCE5FD;
    padding:6px;
    position: relative;
    top: -25px;
  }
 .pharmacyGuideDetail {
   
    .inputStyle{
      width: 200px;
      margin-left: 18px;
    }
   .btnGroup button:not(:last-child){
     margin-right: 8px;
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